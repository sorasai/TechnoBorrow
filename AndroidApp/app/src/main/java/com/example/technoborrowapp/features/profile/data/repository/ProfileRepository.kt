package com.example.technoborrowapp.features.profile.data.repository

import com.example.technoborrowapp.core.network.RetrofitClient
import com.example.technoborrowapp.features.auth.data.model.User
import okhttp3.MultipartBody
import okhttp3.ResponseBody
import retrofit2.Call

class ProfileRepository {
    fun getProfile(userId: Long): Call<User> {
        return RetrofitClient.instance.getProfile(userId)
    }

    fun updateProfile(userId: Long, userUpdate: User): Call<ResponseBody> {
        return RetrofitClient.instance.updateProfile(userId, userUpdate)
    }

    fun changePassword(userId: Long, body: Map<String, String>): Call<ResponseBody> {
        return RetrofitClient.instance.changePassword(userId, body)
    }

    fun uploadPhoto(userId: Long, body: MultipartBody.Part): Call<ResponseBody> {
        return RetrofitClient.instance.uploadPhoto(userId, body)
    }
}
