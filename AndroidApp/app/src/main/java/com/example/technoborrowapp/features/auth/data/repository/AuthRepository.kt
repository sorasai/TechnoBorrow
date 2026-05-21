package com.example.technoborrowapp.features.auth.data.repository

import com.example.technoborrowapp.core.network.RetrofitClient
import com.example.technoborrowapp.features.auth.data.model.LoginRequest
import com.example.technoborrowapp.features.auth.data.model.User
import okhttp3.ResponseBody
import retrofit2.Call

class AuthRepository {
    fun login(request: LoginRequest): Call<ResponseBody> {
        return RetrofitClient.instance.login(request)
    }

    fun register(user: User): Call<User> {
        return RetrofitClient.instance.register(user)
    }
}
