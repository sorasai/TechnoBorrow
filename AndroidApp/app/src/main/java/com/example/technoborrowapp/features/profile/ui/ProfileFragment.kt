package com.example.technoborrowapp.features.profile.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.Fragment
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.auth.ui.LoginActivity
import com.example.technoborrowapp.features.profile.contract.ProfileContract
import com.example.technoborrowapp.features.profile.presenter.ProfilePresenter

class ProfileFragment : Fragment(), ProfileContract.View {

    private lateinit var presenter: ProfileContract.Presenter
    private lateinit var etName: EditText
    private lateinit var etEmail: EditText
    private lateinit var etNewPass: EditText
    private lateinit var etConfirmPass: EditText
    private lateinit var ivAvatar: ImageView

    private val pickImageLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
        uri?.let {
            uploadSelectedPhoto(it)
        }
    }

    private fun uploadSelectedPhoto(uri: android.net.Uri) {
        try {
            val inputStream = requireContext().contentResolver.openInputStream(uri)
            val bytes = inputStream?.readBytes()
            inputStream?.close()

            if (bytes != null) {
                val mimeType = requireContext().contentResolver.getType(uri) ?: "image/jpeg"
                presenter.uploadPhoto(bytes, mimeType)
            }
        } catch (e: Exception) {
            showError("Failed to read image")
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.activity_profile, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Initialize Presenter
        presenter = ProfilePresenter(this)
        
        setupUI(view)
        presenter.start()
    }

    private fun setupUI(view: View) {
        val toolbar = view.findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        toolbar.navigationIcon = null
        
        etName = view.findViewById(R.id.etProfileName)
        etEmail = view.findViewById(R.id.etProfileEmail)
        etNewPass = view.findViewById(R.id.etNewPassword)
        etConfirmPass = view.findViewById(R.id.etConfirmNewPassword)
        ivAvatar = view.findViewById(R.id.ivBigAvatar)

        val btnSave = view.findViewById<Button>(R.id.btnSaveProfile)
        val btnUpdatePass = view.findViewById<Button>(R.id.btnUpdatePassword)
        val btnLogout = view.findViewById<Button>(R.id.btnLogout)
        val btnUpload = view.findViewById<TextView>(R.id.btnUploadPhoto)

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
            pickImageLauncher.launch("image/*")
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
        if (isAdded) {
            Toast.makeText(requireContext(), "Profile updated", Toast.LENGTH_SHORT).show()
            val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
            sharedPref.edit().putString("full_name", newName).apply()
        }
    }

    override fun showPasswordChangeSuccess() {
        if (isAdded) {
            Toast.makeText(requireContext(), "Password changed", Toast.LENGTH_SHORT).show()
            etNewPass.setText("")
            etConfirmPass.setText("")
        }
    }

    override fun showPhotoUploadSuccess() {
        if (isAdded) {
            Toast.makeText(requireContext(), "Photo uploaded successfully", Toast.LENGTH_SHORT).show()
        }
    }

    override fun navigateToLogin() {
        val intent = Intent(requireContext(), LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        requireActivity().finish()
    }

    override fun clearSession() {
        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        sharedPref.edit().clear().apply()
    }

    override fun getUserId(): Long {
        if (!isAdded) return -1L
        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showLoading() {
    }

    override fun hideLoading() {
    }

    override fun showError(message: String) {
        if (isAdded) {
            Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        presenter.onDestroy()
    }
}
