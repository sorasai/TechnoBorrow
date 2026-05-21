package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.dashboard.contract.DashboardContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.Offer
import com.example.technoborrowapp.features.dashboard.data.repository.DashboardRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardPresenter(
    private val view: DashboardContract.View,
    private val repository: DashboardRepository = DashboardRepository()
) : DashboardContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun loadDashboardData() {
        val currentUserId = view.getUserId()
        
        view.showLoading()

        // Fetch all requests
        repository.getAllRequests().enqueue(object : Callback<List<BorrowingRequest>> {
            override fun onResponse(call: Call<List<BorrowingRequest>>, response: Response<List<BorrowingRequest>>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    val allRequests = response.body() ?: emptyList()
                    
                    // Active Requests: User's requests not Returned, Cancelled, or Expired
                    val activeCount = allRequests.count { 
                        it.requesterId == currentUserId && 
                        it.status.uppercase() != "RETURNED" && 
                        it.status.uppercase() != "CANCELLED" && 
                        it.status.uppercase() != "EXPIRED" 
                    }

                    // Explorer list: Posted/Pending requests, sorted with user's own at top
                    val explorer = allRequests.filter { 
                        it.status.uppercase() == "POSTED" || it.status.uppercase() == "PENDING" 
                    }.sortedWith(compareByDescending<BorrowingRequest> { it.requesterId == currentUserId }
                        .thenByDescending { it.id })

                    view.showExplorerRequests(explorer)
                    view.showEmptyState(explorer.isEmpty())
                    
                    // Fetch offers to calculate ongoing/returned counts
                    fetchOfferStats(currentUserId, allRequests, activeCount)

                } else {
                    view.showError("Failed to load requests")
                }
            }

            override fun onFailure(call: Call<List<BorrowingRequest>>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    private fun fetchOfferStats(userId: Long, allRequests: List<BorrowingRequest>, activeCount: Int) {
        if (userId == -1L) {
            view.showStats(activeCount, 0, 0)
            return
        }

        repository.getOffersForUser(userId).enqueue(object : Callback<List<Offer>> {
            override fun onResponse(call: Call<List<Offer>>, response: Response<List<Offer>>) {
                if (response.isSuccessful) {
                    val offers = response.body() ?: emptyList()
                    val offeredReqIds = offers.map { it.requestId }.toSet()

                    val myTrans = allRequests.filter { offeredReqIds.contains(it.id) }

                    val ongoingCount = myTrans.count { 
                        val status = it.status.uppercase()
                        status == "MATCHED" || status == "BORROWED" || 
                        status == "BORROWER_RETURNED" || status == "LENDER_RETURNED" || 
                        status == "ONGOING"
                    }
                    
                    val returnedCount = myTrans.count { it.status.uppercase() == "RETURNED" }
                    
                    view.showStats(activeCount, ongoingCount, returnedCount)
                } else {
                    view.showStats(activeCount, 0, 0)
                }
            }

            override fun onFailure(call: Call<List<Offer>>, t: Throwable) {
                view.showStats(activeCount, 0, 0)
            }
        })
    }

    override fun start() {
        loadDashboardData()
    }

    override fun onDestroy() {
    }
}
