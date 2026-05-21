package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.dashboard.contract.DashboardActivityContract
import com.example.technoborrowapp.features.profile.data.repository.ProfileRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardActivityPresenter(
    private val view: DashboardActivityContract.View,
    private val profileRepository: ProfileRepository = ProfileRepository()
) : DashboardActivityContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun loadAvatar() {
        val userId = view.getUserId()
        if (userId != -1L) {
            profileRepository.getProfile(userId).enqueue(object : Callback<User> {
                override fun onResponse(call: Call<User>, response: Response<User>) {
                    if (response.isSuccessful) {
                        response.body()?.profileImage?.let { imgStr ->
                            view.showAvatar(imgStr)
                        }
                    }
                }
                override fun onFailure(call: Call<User>, t: Throwable) {}
            })
        }
    }

    override fun start() {
        loadAvatar()
    }

    override fun onDestroy() {
    }
}
