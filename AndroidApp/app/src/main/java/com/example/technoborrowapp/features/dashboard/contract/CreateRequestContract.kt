package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import java.util.Calendar

interface CreateRequestContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun showDurationError(message: String)
        fun showDuration(message: String)
        fun showCreationSuccess()
        fun finishView()
    }

    interface Presenter : BasePresenter {
        fun validateDates(startDateTime: Calendar?, endDateTime: Calendar?)
        fun submitRequest(
            name: String, 
            desc: String, 
            purpose: String, 
            startDateTime: Calendar?, 
            endDateTime: Calendar?, 
            base64Image: String?
        )
    }
}
