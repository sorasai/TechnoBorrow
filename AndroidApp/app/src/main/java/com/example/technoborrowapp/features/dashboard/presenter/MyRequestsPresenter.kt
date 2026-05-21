package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.dashboard.contract.MyRequestsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.repository.DashboardRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MyRequestsPresenter(
    private val view: MyRequestsContract.View,
    private val repository: DashboardRepository = DashboardRepository()
) : MyRequestsContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun loadRequests() {
        val currentUserId = view.getUserId()
        if (currentUserId == -1L) return

        view.showLoading()

        repository.getAllRequests().enqueue(object : Callback<List<BorrowingRequest>> {
            override fun onResponse(call: Call<List<BorrowingRequest>>, response: Response<List<BorrowingRequest>>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    val all = response.body() ?: emptyList()
                    val myRequests = all.filter { it.requesterId == currentUserId }
                    
                    val active = myRequests.filter { 
                        it.status.uppercase() != "RETURNED" && 
                        it.status.uppercase() != "CANCELLED" && 
                        it.status.uppercase() != "EXPIRED" 
                    }
                    val past = myRequests.filter { 
                        it.status.uppercase() == "RETURNED" || 
                        it.status.uppercase() == "CANCELLED" || 
                        it.status.uppercase() == "EXPIRED" 
                    }
                    
                    view.showActiveRequests(active)
                    view.showPastRequests(past)

                    view.showEmptyActiveState(active.isEmpty())
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
        loadRequests()
    }

    override fun onDestroy() {
    }
}
