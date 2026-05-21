package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest

interface MyRequestsContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun showActiveRequests(requests: List<BorrowingRequest>)
        fun showPastRequests(requests: List<BorrowingRequest>)
        fun showEmptyActiveState(isEmpty: Boolean)
        fun showEmptyPastState(isEmpty: Boolean)
    }

    interface Presenter : BasePresenter {
        fun loadRequests()
    }
}
