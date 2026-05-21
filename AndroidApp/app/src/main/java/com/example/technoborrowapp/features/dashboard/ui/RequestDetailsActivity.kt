package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.contract.RequestDetailsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.data.model.Offer
import com.example.technoborrowapp.features.dashboard.presenter.RequestDetailsPresenter
import com.google.android.material.button.MaterialButton
import com.google.android.material.imageview.ShapeableImageView

class RequestDetailsActivity : AppCompatActivity(), RequestDetailsContract.View {

    private lateinit var presenter: RequestDetailsContract.Presenter
    private lateinit var offerAdapter: OfferAdapter
    
    private lateinit var tvNoOffersYet: TextView
    private lateinit var rvOffers: RecyclerView
    private lateinit var cvOffersSection: CardView
    private lateinit var btnOfferToLend: MaterialButton
    private lateinit var btnConfirmBorrow: MaterialButton
    private lateinit var btnConfirmReturn: MaterialButton
    private lateinit var tvReturnStatus: TextView
    private lateinit var btnContact: MaterialButton

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_details)

        presenter = RequestDetailsPresenter(this)

        val req = intent.getParcelableExtra<BorrowingRequest>("request")
        if (req == null) {
            Toast.makeText(this, "Error loading request details", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupUI()
        presenter.initialize(req)
    }

    private fun setupUI() {
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        toolbar.setNavigationOnClickListener { finish() }

        rvOffers = findViewById(R.id.rvOffers)
        tvNoOffersYet = findViewById(R.id.tvNoOffersYet)
        cvOffersSection = findViewById(R.id.cvOffersSection)
        btnOfferToLend = findViewById(R.id.btnOfferToLend)
        btnConfirmBorrow = findViewById(R.id.btnConfirmBorrow)
        btnConfirmReturn = findViewById(R.id.btnConfirmReturn)
        tvReturnStatus = findViewById(R.id.tvReturnStatus)
        btnContact = findViewById(R.id.btnContactLender)

        rvOffers.layoutManager = LinearLayoutManager(this)
        offerAdapter = OfferAdapter(emptyList()) { offer ->
            presenter.acceptOffer(offer.id)
        }
        rvOffers.adapter = offerAdapter

        btnOfferToLend.setOnClickListener {
            presenter.createOffer()
        }

        btnConfirmBorrow.setOnClickListener {
            presenter.confirmBorrow()
        }

        btnConfirmReturn.setOnClickListener {
            presenter.confirmReturn()
        }
    }

    override fun setPresenter(presenter: RequestDetailsContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun updateFlow(request: BorrowingRequest) {
        val ivItem = findViewById<ImageView>(R.id.ivItemImageDet)
        val tvName = findViewById<TextView>(R.id.tvItemNameDet)
        val tvStatus = findViewById<TextView>(R.id.tvStatusDet)
        val tvDesc = findViewById<TextView>(R.id.tvDescriptionDet)
        val tvPurpose = findViewById<TextView>(R.id.tvPurposeDet)
        val tvStart = findViewById<TextView>(R.id.tvScheduleStartDet)
        val tvEnd = findViewById<TextView>(R.id.tvScheduleEndDet)
        val ivRequester = findViewById<ShapeableImageView>(R.id.ivRequesterAvatarDet)
        val tvRequesterName = findViewById<TextView>(R.id.tvRequesterNameDet)

        tvName.text = request.itemName
        tvStatus.text = request.status
        tvDesc.text = request.description
        tvPurpose.text = request.purpose ?: "No purpose provided"
        tvStart.text = request.startDate?.replace("T", " ")?.substring(0, 16)
        tvEnd.text = request.endDate?.replace("T", " ")?.substring(0, 16)
        tvRequesterName.text = request.requesterName

        request.itemImage?.let {
            try {
                val bytes = Base64.decode(it, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                ivItem.setImageBitmap(bitmap)
                ivItem.clearColorFilter()
            } catch (e: Exception) {}
        }

        request.requesterImage?.let {
            try {
                val bytes = Base64.decode(it, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                ivRequester.setImageBitmap(bitmap)
            } catch (e: Exception) {}
        }

        cvOffersSection.visibility = View.GONE
        btnOfferToLend.visibility = View.GONE
        btnConfirmBorrow.visibility = View.GONE
        btnConfirmReturn.visibility = View.GONE
        tvReturnStatus.visibility = View.GONE
        btnContact.visibility = View.GONE

        val step1Circle = findViewById<TextView>(R.id.step1_circle)
        val step1Label = findViewById<TextView>(R.id.step1_label)
        val step2Circle = findViewById<TextView>(R.id.step2_circle)
        val step2Label = findViewById<TextView>(R.id.step2_label)
        val step3Circle = findViewById<TextView>(R.id.step3_circle)
        val step3Label = findViewById<TextView>(R.id.step3_label)
        val step4Circle = findViewById<TextView>(R.id.step4_circle)
        val step4Label = findViewById<TextView>(R.id.step4_label)

        val currentStep = when (request.status.uppercase()) {
            "POSTED" -> 0
            "MATCHED", "ONGOING" -> 1
            "BORROWED", "BORROWER_RETURNED", "LENDER_RETURNED" -> 2
            "RETURNED", "COMPLETED" -> 3
            else -> 0
        }

        val circles = arrayOf(step1Circle, step2Circle, step3Circle, step4Circle)
        val labels = arrayOf(step1Label, step2Label, step3Label, step4Label)

        for (i in 0..3) {
            if (i < currentStep) {
                circles[i].setBackgroundResource(R.drawable.stepper_circle_completed)
                circles[i].setTextColor(android.graphics.Color.WHITE)
                circles[i].text = "✓"
                labels[i].setTextColor(android.graphics.Color.parseColor("#10B981"))
            } else if (i == currentStep) {
                circles[i].setBackgroundResource(R.drawable.stepper_circle_active)
                circles[i].setTextColor(android.graphics.Color.WHITE)
                circles[i].text = (i + 1).toString()
                labels[i].setTextColor(android.graphics.Color.parseColor("#7A1E2D"))
            } else {
                circles[i].setBackgroundResource(R.drawable.stepper_circle_inactive)
                circles[i].setTextColor(android.graphics.Color.parseColor("#9CA3AF"))
                circles[i].text = (i + 1).toString()
                labels[i].setTextColor(android.graphics.Color.parseColor("#9CA3AF"))
            }
        }

        val isOwnRequest = getUserId() == request.requesterId

        when (request.status.uppercase()) {
            "POSTED" -> {
                if (isOwnRequest) {
                    cvOffersSection.visibility = View.VISIBLE
                    presenter.fetchOffers()
                } else {
                    btnOfferToLend.visibility = View.VISIBLE
                    presenter.checkIfAlreadyOffered()
                }
            }
            "MATCHED", "ONGOING" -> {
                if (isOwnRequest) {
                    btnConfirmBorrow.visibility = View.VISIBLE
                }
            }
            "BORROWED", "BORROWER_RETURNED", "LENDER_RETURNED" -> {
                presenter.determineReturnFlowState()
            }
        }
    }

    override fun showOffers(offers: List<Offer>) {
        offerAdapter.updateData(offers)
        tvNoOffersYet.visibility = View.GONE
        rvOffers.visibility = View.VISIBLE
    }

    override fun showNoOffers() {
        tvNoOffersYet.visibility = View.VISIBLE
        rvOffers.visibility = View.GONE
    }

    override fun setOfferButtonState(isOffered: Boolean) {
        if (isOffered) {
            btnOfferToLend.isEnabled = false
            btnOfferToLend.text = "Offer Sent"
            btnOfferToLend.setBackgroundColor(android.graphics.Color.parseColor("#E2E8F0"))
            btnOfferToLend.setTextColor(android.graphics.Color.parseColor("#94A3B8"))
        } else {
            btnOfferToLend.isEnabled = true
            btnOfferToLend.text = "Offer to Lend"
            btnOfferToLend.setBackgroundColor(android.graphics.Color.parseColor("#1E3A8A"))
            btnOfferToLend.setTextColor(android.graphics.Color.WHITE)
        }
    }

    override fun showReturnFlow(btnText: String?, statusText: String?) {
        if (btnText != null) {
            btnConfirmReturn.visibility = View.VISIBLE
            btnConfirmReturn.text = btnText
        }
        if (statusText != null) {
            tvReturnStatus.visibility = View.VISIBLE
            tvReturnStatus.text = statusText
        }
    }

    override fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    override fun finishWithResultOk() {
        setResult(RESULT_OK)
        finish()
    }

    override fun showLoading() {
    }

    override fun hideLoading() {
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }
}
