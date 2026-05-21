package com.example.technoborrowapp.features.dashboard.ui

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import android.util.Base64
import android.widget.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.contract.CreateRequestContract
import com.example.technoborrowapp.features.dashboard.presenter.CreateRequestPresenter
import java.io.ByteArrayOutputStream
import java.util.*

class CreateRequestActivity : AppCompatActivity(), CreateRequestContract.View {

    private lateinit var presenter: CreateRequestContract.Presenter
    private lateinit var etItemName: EditText
    private lateinit var etDescription: EditText
    private lateinit var etPurpose: EditText
    private lateinit var tvStartDate: TextView
    private lateinit var tvEndDate: TextView
    private lateinit var tvDuration: TextView
    private lateinit var ivPreview: ImageView
    
    private var base64Image: String? = null
    private var startDateTime: Calendar? = null
    private var endDateTime: Calendar? = null

    private val pickImage = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        uri?.let {
            val inputStream = contentResolver.openInputStream(it)
            val bitmap = BitmapFactory.decodeStream(inputStream)
            ivPreview.setImageBitmap(bitmap)
            ivPreview.setPadding(0, 0, 0, 0)
            
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.JPEG, 70, outputStream)
            val bytes = outputStream.toByteArray()
            base64Image = Base64.encodeToString(bytes, Base64.DEFAULT)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_request)

        presenter = CreateRequestPresenter(this)
        setupUI()
        presenter.start()
    }

    private fun setupUI() {
        val toolbar = findViewById<androidx.appcompat.widget.Toolbar>(R.id.toolbar)
        etItemName = findViewById(R.id.etItemName)
        etDescription = findViewById(R.id.etDescription)
        etPurpose = findViewById(R.id.etPurpose)
        tvStartDate = findViewById(R.id.tvStartDate)
        tvEndDate = findViewById(R.id.tvEndDate)
        tvDuration = findViewById(R.id.tvDuration)
        ivPreview = findViewById(R.id.ivItemPreview)
        val btnSubmit = findViewById<Button>(R.id.btnSubmitRequest)

        toolbar.setNavigationOnClickListener { finish() }

        tvStartDate.setOnClickListener { showDateTimePicker { cal -> 
            startDateTime = cal
            tvStartDate.text = formatDateTime(cal)
            presenter.validateDates(startDateTime, endDateTime)
        }}

        tvEndDate.setOnClickListener { showDateTimePicker { cal -> 
            endDateTime = cal
            tvEndDate.text = formatDateTime(cal)
            presenter.validateDates(startDateTime, endDateTime)
        }}

        ivPreview.setOnClickListener { pickImage.launch("image/*") }

        btnSubmit.setOnClickListener { 
            presenter.submitRequest(
                etItemName.text.toString().trim(),
                etDescription.text.toString().trim(),
                etPurpose.text.toString().trim(),
                startDateTime,
                endDateTime,
                base64Image
            )
        }
    }

    private fun showDateTimePicker(onSelected: (Calendar) -> Unit) {
        val c = Calendar.getInstance()
        DatePickerDialog(this, { _, year, month, day ->
            TimePickerDialog(this, { _, hour, minute ->
                val selected = Calendar.getInstance()
                selected.set(year, month, day, hour, minute)
                onSelected(selected)
            }, c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE), true).show()
        }, c.get(Calendar.YEAR), c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH)).show()
    }

    private fun formatDateTime(cal: Calendar): String {
        return String.format("%04d-%02d-%02d %02d:%02d", 
            cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH),
            cal.get(Calendar.HOUR_OF_DAY), cal.get(Calendar.MINUTE))
    }

    override fun setPresenter(presenter: CreateRequestContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showDurationError(message: String) {
        tvDuration.text = message
        tvDuration.setTextColor(android.graphics.Color.RED)
        if (message.contains("cannot exceed")) {
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }
    }

    override fun showDuration(message: String) {
        tvDuration.text = message
        tvDuration.setTextColor(android.graphics.Color.parseColor("#7A1E2D"))
    }

    override fun showCreationSuccess() {
        Toast.makeText(this, "Request posted successfully!", Toast.LENGTH_LONG).show()
        setResult(RESULT_OK)
    }

    override fun finishView() {
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
