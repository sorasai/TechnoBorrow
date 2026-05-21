package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest

interface DashboardContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun showStats(activeCount: Int, ongoingCount: Int, returnedCount: Int)
        fun showExplorerRequests(requests: List<BorrowingRequest>)
        fun showEmptyState(isEmpty: Boolean)
    }

    interface Presenter : BasePresenter {
        fun loadDashboardData()
    }
}
