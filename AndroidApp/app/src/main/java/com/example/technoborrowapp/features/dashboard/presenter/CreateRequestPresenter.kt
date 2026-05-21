package com.example.technoborrowapp.features.dashboard.presenter

import com.example.technoborrowapp.features.dashboard.contract.CreateRequestContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.CreateBorrowingRequestDTO
import com.example.technoborrowapp.features.dashboard.data.repository.DashboardRepository
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Calendar

class CreateRequestPresenter(
    private val view: CreateRequestContract.View,
    private val repository: DashboardRepository = DashboardRepository()
) : CreateRequestContract.Presenter {

    init {
        view.setPresenter(this)
    }

    override fun validateDates(startDateTime: Calendar?, endDateTime: Calendar?) {
        if (startDateTime != null && endDateTime != null) {
            val diffMs = endDateTime.timeInMillis - startDateTime.timeInMillis
            if (diffMs < 0) {
                view.showDurationError("Error: End must be after Start")
            } else {
                val diffHrs = diffMs.toDouble() / (1000 * 60 * 60)
                if (diffHrs > 24) {
                    view.showDurationError("Duration cannot exceed 24 hours")
                } else {
                    view.showDuration(String.format("Total Duration: %.1f hours", diffHrs))
                }
            }
        }
    }

    override fun submitRequest(
        name: String,
        desc: String,
        purpose: String,
        startDateTime: Calendar?,
        endDateTime: Calendar?,
        base64Image: String?
    ) {
        if (name.isEmpty() || desc.isEmpty() || purpose.isEmpty()) {
            view.showError("Please fill all required fields")
            return
        }

        if (startDateTime == null || endDateTime == null) {
            view.showError("Please select both start and end dates")
            return
        }

        val diffHrs = (endDateTime.timeInMillis - startDateTime.timeInMillis).toDouble() / (1000 * 60 * 60)
        if (diffHrs < 0 || diffHrs > 24) {
            view.showError("Invalid duration (must be 0-24 hours)")
            return
        }

        val userId = view.getUserId()
        if (userId == -1L) {
            view.showError("Session expired. Please login again.")
            return
        }

        view.showLoading()

        val startStr = String.format("%04d-%02d-%02dT%02d:%02d:00",
            startDateTime.get(Calendar.YEAR), startDateTime.get(Calendar.MONTH) + 1, startDateTime.get(Calendar.DAY_OF_MONTH),
            startDateTime.get(Calendar.HOUR_OF_DAY), startDateTime.get(Calendar.MINUTE))
        
        val endStr = String.format("%04d-%02d-%02dT%02d:%02d:00",
            endDateTime.get(Calendar.YEAR), endDateTime.get(Calendar.MONTH) + 1, endDateTime.get(Calendar.DAY_OF_MONTH),
            endDateTime.get(Calendar.HOUR_OF_DAY), endDateTime.get(Calendar.MINUTE))

        val dto = CreateBorrowingRequestDTO(
            requesterId = userId,
            itemName = name,
            description = desc,
            purpose = purpose,
            startDate = startStr,
            endDate = endStr,
            itemImage = base64Image
        )

        repository.createRequest(dto).enqueue(object : Callback<BorrowingRequest> {
            override fun onResponse(call: Call<BorrowingRequest>, response: Response<BorrowingRequest>) {
                view.hideLoading()
                if (response.isSuccessful) {
                    view.showCreationSuccess()
                    view.finishView()
                } else {
                    view.showError("Failed to post request")
                }
            }

            override fun onFailure(call: Call<BorrowingRequest>, t: Throwable) {
                view.hideLoading()
                view.showError("Error: ${t.message}")
            }
        })
    }

    override fun start() {
    }

    override fun onDestroy() {
    }
}
