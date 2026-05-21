package com.example.technoborrowapp.features.profile.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.auth.data.model.User

interface ProfileContract {
    interface View : BaseView<Presenter> {
        fun showProfileData(user: User)
        fun showProfileUpdateSuccess(newName: String)
        fun showPasswordChangeSuccess()
        fun showPhotoUploadSuccess()
        fun navigateToLogin()
        fun clearSession()
        fun getUserId(): Long
    }

    interface Presenter : BasePresenter {
        fun loadProfile()
        fun updateProfile(name: String, email: String)
        fun changePassword(newPass: String, confirmPass: String)
        fun uploadPhoto(imageBytes: ByteArray, mimeType: String)
        fun logout()
    }
}
