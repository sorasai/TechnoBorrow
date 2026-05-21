package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest

interface MyTransactionsContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun showOngoingTransactions(requests: List<BorrowingRequest>)
        fun showPastTransactions(requests: List<BorrowingRequest>)
        fun showEmptyOngoingState(isEmpty: Boolean)
        fun showEmptyPastState(isEmpty: Boolean)
    }

    interface Presenter : BasePresenter {
        fun loadTransactions()
    }
}
