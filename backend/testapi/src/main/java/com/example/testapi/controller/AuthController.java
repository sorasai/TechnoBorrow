package com.example.testapi.controller;

import com.example.testapi.model.LoginRequest;
import com.example.testapi.model.User;
import com.example.testapi.service.AuthService;
import com.example.testapi.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /*
     REGISTER USER
     */
    @PostMapping("/register")
    public Object register(@RequestBody User user) {
        try {
            User newUser = authService.register(
                    user.getEmail(),
                    user.getPasswordHash(), // raw password from frontend
                    user.getFullName()
            );

            return newUser;

        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }

    /*
     LOGIN USER
     */
    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            return user;

        } catch (Exception e) {
            return "Login Failed: " + e.getMessage();
        }
    }

    /*
     GET USER PROFILE
     */
    @GetMapping("/profile/{id}")
    public Object getProfile(@PathVariable Long id) {

        return userRepository.findById(id)
                .map(user -> (Object) user)
                .orElse("User not found");
    }

    /*
     UPDATE PROFILE (NAME ONLY)
     */
    @PutMapping("/profile/edit/{id}")
    public String editProfile(@PathVariable Long id, @RequestBody User updatedData) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        user.setFullName(updatedData.getFullName());
        userRepository.save(user);

        return "Profile Updated";
    }

    /*
     CHANGE PASSWORD
     */
    @PutMapping("/profile/password/{id}")
    public String changePassword(@PathVariable Long id,
                                 @RequestBody Map<String, String> body) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        String newPassword = body.get("newPassword");

        if (newPassword == null || newPassword.isEmpty()) {
            return "New password cannot be empty";
        }

        // ✅ HASH PASSWORD (FIXED)
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return "Password Changed Successfully";
    }

    /*
     UPLOAD PROFILE PHOTO
     */
    @PostMapping("/profile/upload/{id}")
    public String uploadPhoto(@PathVariable Long id,
                              @RequestParam("file") MultipartFile file) throws IOException {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return "User not found";
        }

        String contentType = file.getContentType();

        if (!contentType.equals("image/jpeg") &&
                !contentType.equals("image/png")) {
            return "Only JPG and PNG images are allowed";   
        }

        user.setProfileImage(file.getBytes());
        userRepository.save(user);

        return "Photo Uploaded Successfully";
    }
}