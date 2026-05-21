package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView

interface DashboardActivityContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun showAvatar(base64Image: String)
    }

    interface Presenter : BasePresenter {
        fun loadAvatar()
    }
}
