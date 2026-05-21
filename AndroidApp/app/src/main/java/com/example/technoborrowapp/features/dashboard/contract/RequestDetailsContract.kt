package com.example.technoborrowapp.features.dashboard.contract

import com.example.technoborrowapp.core.ui.BasePresenter
import com.example.technoborrowapp.core.ui.BaseView
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.Offer

interface RequestDetailsContract {
    interface View : BaseView<Presenter> {
        fun getUserId(): Long
        fun updateFlow(request: BorrowingRequest)
        fun showOffers(offers: List<Offer>)
        fun showNoOffers()
        fun setOfferButtonState(isOffered: Boolean)
        fun showReturnFlow(btnText: String?, statusText: String?)
        fun showSuccess(message: String)
        fun finishWithResultOk()
    }

    interface Presenter : BasePresenter {
        fun initialize(request: BorrowingRequest)
        fun fetchOffers()
        fun createOffer()
        fun acceptOffer(offerId: Long)
        fun confirmBorrow()
        fun confirmReturn()
        fun determineReturnFlowState()
        fun checkIfAlreadyOffered()
    }
}
