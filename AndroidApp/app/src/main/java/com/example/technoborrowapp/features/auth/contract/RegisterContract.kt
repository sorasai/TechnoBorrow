package com.example.technoborrowapp.features.auth.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView

interface RegisterContract {
    interface View : BaseView<Presenter> {
        fun navigateToLogin()
        fun showRegisterSuccess()
    }

    interface Presenter : BasePresenter {
        fun register(fullName: String, email: String, password: String, confirmPassword: String)
    }
}
