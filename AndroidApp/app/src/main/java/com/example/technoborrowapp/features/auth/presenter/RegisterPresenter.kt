package com.example.technoborrowapp.features.auth.presenter

import com.example.technoborrowapp.features.auth.contract.RegisterContract
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.auth.data.repository.AuthRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RegisterPresenter(
    private val view: RegisterContract.View,
    private val repository: AuthRepository = AuthRepository()
) : RegisterContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun register(fullName: String, email: String, password: String, confirmPassword: String) {
        if (fullName.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
            view.showError("Please fill all fields")
            return
        }

        if (password != confirmPassword) {
            view.showError("Passwords do not match")
            return
        }

        view.showLoading()
        val user = User(fullName = fullName, email = email, passwordHash = password)

        repository.register(user).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showRegisterSuccess()
                    view.navigateToLogin()
                } else {
                    val errorMsg = response.errorBody()?.string() ?: "Unknown error"
                    view.showError("Registration failed: $errorMsg")
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun start() {
    }

    override fun onDestroy() {
    }
}
