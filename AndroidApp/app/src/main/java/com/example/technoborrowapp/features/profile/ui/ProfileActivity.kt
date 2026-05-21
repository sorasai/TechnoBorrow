package com.example.technoborrowapp.features.profile.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.auth.ui.LoginActivity
import com.example.technoborrowapp.features.profile.contract.ProfileContract
import com.example.technoborrowapp.features.profile.presenter.ProfilePresenter

class ProfileActivity : AppCompatActivity(), ProfileContract.View {

    private lateinit var presenter: ProfileContract.Presenter
    private lateinit var etName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etNewPass: EditText
    private lateinit var etConfirmPass: EditText
    private lateinit var ivAvatar: ImageView
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        // Initialize Presenter
        presenter = ProfilePresenter(this)

        setupUI()
        presenter.start()
    }

    private fun setupUI() {
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        etName = findViewById(R.id.etProfileName)
        etEmail = findViewById(R.id.etProfileEmail)
        etNewPass = findViewById(R.id.etNewPassword)
        etConfirmPass = findViewById(R.id.etConfirmNewPassword)
        ivAvatar = findViewById(R.id.ivBigAvatar)

        val btnSave = findViewById<Button>(R.id.btnSaveProfile)
        val btnUpdatePass = findViewById<Button>(R.id.btnUpdatePassword)
        val btnLogout = findViewById<Button>(R.id.btnLogout)
        val btnUpload = findViewById<TextView>(R.id.btnUploadPhoto)

        toolbar.setNavigationOnClickListener { finish() }

        btnSave.setOnClickListener { 
            presenter.updateProfile(etName.text.toString().trim(), etEmail.text.toString().trim())
        }
        btnUpdatePass.setOnClickListener { 
            presenter.changePassword(etNewPass.text.toString(), etConfirmPass.text.toString())
        }
        btnLogout.setOnClickListener { 
            presenter.logout()
        }
        
        btnUpload.setOnClickListener {
            Toast.makeText(this, "Photo upload coming soon!", Toast.LENGTH_SHORT).show()
        }
    }

    override fun setPresenter(presenter: ProfileContract.Presenter) {
        this.presenter = presenter
    }

    override fun showProfileData(user: User) {
        etName.setText(user.fullName)
        etEmail.setText(user.email)
        
        user.profileImage?.let { imgStr ->
            try {
                val decodedString = android.util.Base64.decode(imgStr, android.util.Base64.DEFAULT)
                val bitmap = android.graphics.BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                ivAvatar.setImageBitmap(bitmap)
            } catch (e: Exception) {}
        }
    }

    override fun showProfileUpdateSuccess(newName: String) {
        Toast.makeText(this, "Profile updated", Toast.LENGTH_SHORT).show()
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        sharedPref.edit().putString("full_name", newName).apply()
    }

    override fun showPasswordChangeSuccess() {
        Toast.makeText(this, "Password changed successfully", Toast.LENGTH_SHORT).show()
        etNewPass.setText("")
        etConfirmPass.setText("")
    }

    override fun showPhotoUploadSuccess() {
        Toast.makeText(this, "Photo uploaded successfully", Toast.LENGTH_SHORT).show()
    }

    override fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    override fun clearSession() {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
    }

    override fun getUserId(): Long {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showLoading() {
        // Show loading indicator
    }

    override fun hideLoading() {
        // Hide loading indicator
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }
}
