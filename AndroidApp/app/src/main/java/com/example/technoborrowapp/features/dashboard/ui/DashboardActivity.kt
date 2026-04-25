package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.content.Intent
import android.graphics.BitmapFactory
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.technoborrowapp.R
import com.example.technoborrowapp.core.network.RetrofitClient
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.profile.ui.ProfileActivity
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardActivity : AppCompatActivity() {

    private lateinit var adapter: RequestAdapter
    private lateinit var rvRequests: RecyclerView

    private val createRequestLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK) {
            fetchData() // Refresh list
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        setupUI()
        fetchData()
    }

    private fun setupUI() {
        val tvWelcome = findViewById<TextView>(R.id.tvWelcome)
        val ivAvatar = findViewById<ImageView>(R.id.ivToolbarAvatar)
        val fabCreate = findViewById<FloatingActionButton>(R.id.fabCreateRequest)
        rvRequests = findViewById(R.id.rvRequests)

        // Get saved user data
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        val fullName = sharedPref.getString("full_name", "User")
        val userId = sharedPref.getLong("user_id", -1L)

        tvWelcome.text = "Welcome, ${fullName?.split(" ")?.get(0)}!"
        
        // Fetch full profile to get current avatar
        if (userId != -1L) {
            RetrofitClient.instance.getProfile(userId).enqueue(object : Callback<User> {
                override fun onResponse(call: Call<User>, response: Response<User>) {
                    if (response.isSuccessful) {
                        response.body()?.profileImage?.let { imgStr ->
                            try {
                                val decodedString = android.util.Base64.decode(imgStr, android.util.Base64.DEFAULT)
                                val bitmap = android.graphics.BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
                                ivAvatar.setImageBitmap(bitmap)
                            } catch (e: Exception) {}
                        }
                    }
                }
                override fun onFailure(call: Call<User>, t: Throwable) {}
            })
        }

        ivAvatar.setOnClickListener {
            startActivity(Intent(this, ProfileActivity::class.java))
        }

        // Setup FAB
        fabCreate.setOnClickListener {
            createRequestLauncher.launch(Intent(this, CreateRequestActivity::class.java))
        }

        // Setup RecyclerView
        rvRequests.layoutManager = LinearLayoutManager(this)
        adapter = RequestAdapter(emptyList()) { request ->
            val intent = Intent(this, RequestDetailsActivity::class.java)
            intent.putExtra("request", request)
            startActivity(intent)
        }
        rvRequests.adapter = adapter
    }

    private fun fetchData() {
        RetrofitClient.instance.getAllRequests()
            .enqueue(object : Callback<List<BorrowingRequest>> {
                override fun onResponse(
                    call: Call<List<BorrowingRequest>>,
                    response: Response<List<BorrowingRequest>>
                ) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            adapter.updateData(it)
                        }
                    } else {
                        Toast.makeText(this@DashboardActivity, "Failed to load requests", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<List<BorrowingRequest>>, t: Throwable) {
                    Toast.makeText(this@DashboardActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
