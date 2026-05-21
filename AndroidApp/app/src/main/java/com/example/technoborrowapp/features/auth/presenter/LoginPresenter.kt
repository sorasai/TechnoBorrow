package com.example.technoborrowapp.features.auth.presenter

import com.example.technoborrowapp.features.auth.contract.LoginContract
import com.example.technoborrowapp.features.auth.data.model.LoginRequest
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.auth.data.repository.AuthRepository
import com.google.gson.Gson
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginPresenter(
    private val view: LoginContract.View,
    private val repository: AuthRepository = AuthRepository()
) : LoginContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun login(email: String, password: String) {
        if (email.isEmpty() || password.isEmpty()) {
            view.showError("Please fill all fields")
            return
        }

        view.showLoading()
        val request = LoginRequest(email, password)

        repository.login(request).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                view.hideLoading()
                val responseBody = response.body()?.string() ?: response.errorBody()?.string()

                if (response.isSuccessful && responseBody != null) {
                    try {
                        if (responseBody.trim().startsWith("{")) {
                            // It's likely a JSON object (User)
                            val user = Gson().fromJson(responseBody, User::class.java)
                            if (user != null && user.id != null) {
                                view.saveSession(user)
                                view.showLoginSuccess(user)
                                view.navigateToDashboard()
                            } else {
                                view.showError("Server error: Invalid user data")
                            }
                        } else {
                            // It's likely a plain error message string
                            view.showError(responseBody)
                        }
                    } catch (e: Exception) {
                        view.showError("Error: ${e.message}")
                    }
                } else {
                    view.showError("Login failed: ${responseBody ?: "Unknown error"}")
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun start() {
        // Initialization if needed
    }

    override fun onDestroy() {
        // Cleanup if needed (e.g., cancel active network calls)
    }
}
