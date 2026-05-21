package com.example.technoborrowapp.features.profile.presenter

import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.profile.contract.ProfileContract
import com.example.technoborrowapp.features.profile.data.repository.ProfileRepository
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfilePresenter(
    private val view: ProfileContract.View,
    private val repository: ProfileRepository = ProfileRepository()
) : ProfileContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun loadProfile() {
        val userId = view.getUserId()
        if (userId == -1L) {
            view.showError("Session expired")
            view.clearSession()
            view.navigateToLogin()
            return
        }

        repository.getProfile(userId).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    response.body()?.let { user ->
                        view.showProfileData(user)
                    }
                } else {
                    view.showError("Failed to load profile")
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                view.showError("Error: ${t.message}")
            }
        })
    }

    override fun updateProfile(name: String, email: String) {
        val userId = view.getUserId()
        if (userId == -1L) return

        if (name.isEmpty()) {
            view.showError("Name cannot be empty")
            return
        }

        view.showLoading()
        val userUpdate = User(fullName = name, email = email)
        
        repository.updateProfile(userId, userUpdate).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showProfileUpdateSuccess(name)
                } else {
                    view.showError("Update failed")
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                view.hideLoading()
                view.showError("Error: ${t.message}")
            }
        })
    }

    override fun changePassword(newPass: String, confirmPass: String) {
        val userId = view.getUserId()
        if (userId == -1L) return

        if (newPass.isEmpty()) {
            view.showError("Please enter new password")
            return
        }
        
        if (newPass != confirmPass) {
            view.showError("Passwords do not match")
            return
        }

        view.showLoading()
        val body = mapOf("newPassword" to newPass)
        
        repository.changePassword(userId, body).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showPasswordChangeSuccess()
                } else {
                    view.showError("Failed to change password")
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                view.hideLoading()
                view.showError("Error: ${t.message}")
            }
        })
    }

    override fun uploadPhoto(imageBytes: ByteArray, mimeType: String) {
        val userId = view.getUserId()
        if (userId == -1L) return

        view.showLoading()
        val requestFile = RequestBody.create(MediaType.parse(mimeType), imageBytes)
        val body = MultipartBody.Part.createFormData("file", "avatar.jpg", requestFile)

        repository.uploadPhoto(userId, body).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showPhotoUploadSuccess()
                    loadProfile() // Reload profile to show new image
                } else {
                    view.showError("Failed to upload photo")
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                view.hideLoading()
                view.showError("Error: ${t.message}")
            }
        })
    }

    override fun logout() {
        view.clearSession()
        view.navigateToLogin()
    }

    override fun start() {
        loadProfile()
    }

    override fun onDestroy() {
        // Cleanup
    }
}
