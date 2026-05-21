package com.example.technoborrowapp.features.auth.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.auth.data.model.User

interface LoginContract {
    interface View : BaseView<Presenter> {
        fun navigateToDashboard()
        fun showLoginSuccess(user: User)
        fun saveSession(user: User)
    }

    interface Presenter : BasePresenter {
        fun login(email: String, password: String)
    }
}
