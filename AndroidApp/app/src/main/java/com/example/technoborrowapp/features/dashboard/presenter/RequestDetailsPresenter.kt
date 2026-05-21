package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.dashboard.contract.RequestDetailsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.CreateOfferDTO
import com.example.technoborrowapp.features.dashboard.data.model.Offer
import com.example.technoborrowapp.features.dashboard.data.repository.DashboardRepository
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class RequestDetailsPresenter(
    private val view: RequestDetailsContract.View,
    private val repository: DashboardRepository = DashboardRepository()
) : RequestDetailsContract.Presenter {

    private lateinit var currentRequest: BorrowingRequest
    private var currentUserId: Long = -1L

    init {
        view.setPresenter(this)
    }

    override fun initialize(request: BorrowingRequest) {
        currentRequest = request
        currentUserId = view.getUserId()
        view.updateFlow(currentRequest)
    }

    override fun fetchOffers() {
        repository.getOffersForRequest(currentRequest.id).enqueue(object : Callback<List<Offer>> {
            override fun onResponse(call: Call<List<Offer>>, response: Response<List<Offer>>) {
                if (response.isSuccessful) {
                    val offers = response.body() ?: emptyList()
                    if (offers.isEmpty()) {
                        view.showNoOffers()
                    } else {
                        view.showOffers(offers)
                    }
                }
            }
            override fun onFailure(call: Call<List<Offer>>, t: Throwable) {
                view.showError("Error fetching offers")
            }
        })
    }

    override fun checkIfAlreadyOffered() {
        repository.getOffersForRequest(currentRequest.id).enqueue(object : Callback<List<Offer>> {
            override fun onResponse(call: Call<List<Offer>>, response: Response<List<Offer>>) {
                if (response.isSuccessful) {
                    val offers = response.body() ?: emptyList()
                    val hasOffered = offers.any { it.lenderId == currentUserId }
                    view.setOfferButtonState(hasOffered)
                }
            }
            override fun onFailure(call: Call<List<Offer>>, t: Throwable) {}
        })
    }

    override fun determineReturnFlowState() {
        repository.getOffersForRequest(currentRequest.id).enqueue(object : Callback<List<Offer>> {
            override fun onResponse(call: Call<List<Offer>>, response: Response<List<Offer>>) {
                if (response.isSuccessful) {
                    val offers = response.body() ?: emptyList()
                    val acceptedOffer = offers.find { it.status.uppercase() == "ACCEPTED" }
                    if (acceptedOffer != null) {
                        val isLender = currentUserId == acceptedOffer.lenderId
                        val isBorrower = currentUserId == currentRequest.requesterId

                        var btnText: String? = null
                        var statusText: String? = null

                        when (currentRequest.status.uppercase()) {
                            "BORROWED" -> {
                                if (isBorrower) {
                                    btnText = "Mark as Returned"
                                } else if (isLender) {
                                    btnText = "Confirm Return"
                                }
                            }
                            "BORROWER_RETURNED" -> {
                                if (isBorrower) {
                                    statusText = "Waiting for other user to confirm return..."
                                } else if (isLender) {
                                    btnText = "Confirm Return"
                                }
                            }
                            "LENDER_RETURNED" -> {
                                if (isBorrower) {
                                    btnText = "Mark as Returned"
                                } else if (isLender) {
                                    statusText = "Waiting for other user to confirm return..."
                                }
                            }
                        }
                        view.showReturnFlow(btnText, statusText)
                    }
                }
            }
            override fun onFailure(call: Call<List<Offer>>, t: Throwable) {}
        })
    }

    override fun createOffer() {
        val dto = CreateOfferDTO(currentRequest.id, currentUserId, "I can lend this item.")
        view.showLoading()
        repository.createOffer(dto).enqueue(object : Callback<Offer> {
            override fun onResponse(call: Call<Offer>, response: Response<Offer>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showSuccess("Offer submitted!")
                    view.finishWithResultOk()
                } else {
                    view.showError("Failed to submit offer")
                }
            }
            override fun onFailure(call: Call<Offer>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun acceptOffer(offerId: Long) {
        view.showLoading()
        repository.acceptOffer(offerId).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showSuccess("Offer accepted!")
                    currentRequest = currentRequest.copy(status = "MATCHED")
                    view.updateFlow(currentRequest)
                    view.finishWithResultOk()
                } else {
                    view.showError("Failed to accept offer")
                }
            }
            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun confirmBorrow() {
        view.showLoading()
        repository.confirmBorrow(currentRequest.id).enqueue(object : Callback<BorrowingRequest> {
            override fun onResponse(call: Call<BorrowingRequest>, response: Response<BorrowingRequest>) {
                view.hideLoading()
                if (response.isSuccessful && response.body() != null) {
                    view.showSuccess("Confirmed borrow receipt!")
                    currentRequest = response.body()!!
                    view.updateFlow(currentRequest)
                    view.finishWithResultOk()
                } else {
                    view.showError("Failed to confirm borrow")
                }
            }
            override fun onFailure(call: Call<BorrowingRequest>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun confirmReturn() {
        view.showLoading()
        repository.confirmReturn(currentRequest.id, currentUserId).enqueue(object : Callback<BorrowingRequest> {
            override fun onResponse(call: Call<BorrowingRequest>, response: Response<BorrowingRequest>) {
                view.hideLoading()
                if (response.isSuccessful && response.body() != null) {
                    view.showSuccess("Return confirmed!")
                    currentRequest = response.body()!!
                    view.updateFlow(currentRequest)
                    view.finishWithResultOk()
                } else {
                    view.showError("Failed to confirm return")
                }
            }
            override fun onFailure(call: Call<BorrowingRequest>, t: Throwable) {
                view.hideLoading()
                view.showError("Network error: ${t.message}")
            }
        })
    }

    override fun start() {
    }

    override fun onDestroy() {
    }
}
