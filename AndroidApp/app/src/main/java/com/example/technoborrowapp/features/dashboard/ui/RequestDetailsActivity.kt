package com.example.technoborrowapp.features.dashboard.ui

import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.google.android.material.button.MaterialButton
import com.google.android.material.imageview.ShapeableImageView

class RequestDetailsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_request_details)

        val request = intent.getParcelableExtra<BorrowingRequest>("request")
        if (request == null) {
            Toast.makeText(this, "Error loading request details", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        setupUI(request)
    }

    private fun setupUI(request: BorrowingRequest) {
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        val ivItem = findViewById<ImageView>(R.id.ivItemImageDet)
        val tvName = findViewById<TextView>(R.id.tvItemNameDet)
        val tvStatus = findViewById<TextView>(R.id.tvStatusDet)
        val tvDesc = findViewById<TextView>(R.id.tvDescriptionDet)
        val tvPurpose = findViewById<TextView>(R.id.tvPurposeDet)
        val tvStart = findViewById<TextView>(R.id.tvScheduleStartDet)
        val tvEnd = findViewById<TextView>(R.id.tvScheduleEndDet)
        val ivRequester = findViewById<ShapeableImageView>(R.id.ivRequesterAvatarDet)
        val tvRequesterName = findViewById<TextView>(R.id.tvRequesterNameDet)
        val btnContact = findViewById<MaterialButton>(R.id.btnContactLender)

        toolbar.setNavigationOnClickListener { finish() }

        tvName.text = request.itemName
        tvStatus.text = request.status
        tvDesc.text = request.description
        tvPurpose.text = request.purpose ?: "No purpose provided"
        tvStart.text = request.startDate?.replace("T", " ")?.substring(0, 16)
        tvEnd.text = request.endDate?.replace("T", " ")?.substring(0, 16)
        tvRequesterName.text = request.requesterName

        // Decode item image
        request.itemImage?.let {
            try {
                val bytes = Base64.decode(it, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                ivItem.setImageBitmap(bitmap)
                ivItem.clearColorFilter()
            } catch (e: Exception) {}
        }

        // Decode requester image
        request.requesterImage?.let {
            try {
                val bytes = Base64.decode(it, Base64.DEFAULT)
                val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
                ivRequester.setImageBitmap(bitmap)
            } catch (e: Exception) {}
        }

        btnContact.setOnClickListener {
            Toast.makeText(this, "Contacting ${request.requesterName}...", Toast.LENGTH_SHORT).show()
        }
    }
}
