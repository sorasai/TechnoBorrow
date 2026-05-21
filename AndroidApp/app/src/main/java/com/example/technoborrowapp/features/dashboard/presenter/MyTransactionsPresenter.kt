package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.dashboard.contract.MyTransactionsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.Offer
import com.example.technoborrowapp.features.dashboard.data.repository.DashboardRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MyTransactionsPresenter(
    private val view: MyTransactionsContract.View,
    private val repository: DashboardRepository = DashboardRepository()
) : MyTransactionsContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun loadTransactions() {
        val currentUserId = view.getUserId()
        if (currentUserId == -1L) return

        view.showLoading()

        repository.getOffersForUser(currentUserId).enqueue(object : Callback<List<Offer>> {
            override fun onResponse(call: Call<List<Offer>>, response: Response<List<Offer>>) {
                if (response.isSuccessful) {
                    val offers = response.body() ?: emptyList()
                    val offeredReqIds = offers.map { it.requestId }.toSet()
                    
                    fetchRequestsAndFilter(currentUserId, offeredReqIds)
                } else {
                    view.hideLoading()
                    view.showError("Failed to fetch offers")
                }
            }

            override fun onFailure(call: Call<List<Offer>>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    private fun fetchRequestsAndFilter(currentUserId: Long, offeredReqIds: Set<Long>) {
        repository.getAllRequests().enqueue(object : Callback<List<BorrowingRequest>> {
            override fun onResponse(call: Call<List<BorrowingRequest>>, response: Response<List<BorrowingRequest>>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    val all = response.body() ?: emptyList()
                    val myTransactions = all.filter { offeredReqIds.contains(it.id) || it.requesterId == currentUserId }
                    
                    val ongoing = myTransactions.filter { 
                        val status = it.status.uppercase()
                        status == "MATCHED" || status == "BORROWED" || status == "BORROWER_RETURNED" || status == "LENDER_RETURNED" || status == "ONGOING"
                    }
                    val past = myTransactions.filter { 
                        it.status.uppercase() == "RETURNED" || it.status.uppercase() == "CANCELLED" || it.status.uppercase() == "EXPIRED" 
                    }

                    view.showOngoingTransactions(ongoing)
                    view.showPastTransactions(past)

                    view.showEmptyOngoingState(ongoing.isEmpty())
                    view.showEmptyPastState(past.isEmpty())
                } else {
                    view.showError("Failed to fetch requests")
                }
            }

            override fun onFailure(call: Call<List<BorrowingRequest>>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun start() {
        loadTransactions()
    }

    override fun onDestroy() {
    }
}
