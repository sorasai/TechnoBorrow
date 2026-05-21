package com.example.technoborrowapp.features.dashboard.data.repository

import com.example.technoborrowapp.core.network.RetrofitClient
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.CreateBorrowingRequestDTO
import com.example.technoborrowapp.features.dashboard.data.model.CreateOfferDTO
import com.example.technoborrowapp.features.dashboard.data.model.Offer
import okhttp3.ResponseBody
import retrofit2.Call

class DashboardRepository {
    fun getAllRequests(): Call<List<BorrowingRequest>> {
        return RetrofitClient.instance.getAllRequests()
    }

    fun createRequest(request: CreateBorrowingRequestDTO): Call<BorrowingRequest> {
        return RetrofitClient.instance.createRequest(request)
    }

    fun createOffer(offer: CreateOfferDTO): Call<Offer> {
        return RetrofitClient.instance.createOffer(offer)
    }

    fun getOffersForRequest(requestId: Long): Call<List<Offer>> {
        return RetrofitClient.instance.getOffersForRequest(requestId)
    }

    fun getOffersForUser(userId: Long): Call<List<Offer>> {
        return RetrofitClient.instance.getOffersForUser(userId)
    }

    fun acceptOffer(offerId: Long): Call<ResponseBody> {
        return RetrofitClient.instance.acceptOffer(offerId)
    }

    fun confirmBorrow(id: Long): Call<BorrowingRequest> {
        return RetrofitClient.instance.confirmBorrow(id)
    }

    fun confirmReturn(id: Long, userId: Long): Call<BorrowingRequest> {
        return RetrofitClient.instance.confirmReturn(id, userId)
    }
}
