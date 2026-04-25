package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.technoborrowapp.R
import com.example.technoborrowapp.core.network.RetrofitClient
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DashboardFragment : Fragment() {

    private lateinit var adapter: RequestAdapter
    private lateinit var rvRequests: RecyclerView

    private val createRequestLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == AppCompatActivity.RESULT_OK) {
            fetchData() 
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.activity_dashboard, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupUI(view)
        fetchData()
    }

    private fun setupUI(view: View) {
        val tvWelcome = view.findViewById<TextView>(R.id.tvWelcome)
        val ivAvatar = view.findViewById<ImageView>(R.id.ivToolbarAvatar)
        val fabCreate = view.findViewById<FloatingActionButton>(R.id.fabCreateRequest)
        rvRequests = view.findViewById(R.id.rvRequests)

        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        val fullName = sharedPref.getString("full_name", "User")
        val userId = sharedPref.getLong("user_id", -1L)

        tvWelcome.text = "Welcome, ${fullName?.split(" ")?.get(0)}!"
        
        if (userId != -1L) {
            RetrofitClient.instance.getProfile(userId).enqueue(object : Callback<User> {
                override fun onResponse(call: Call<User>, response: Response<User>) {
                    if (isAdded && response.isSuccessful) {
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

        fabCreate.setOnClickListener {
            createRequestLauncher.launch(Intent(requireContext(), CreateRequestActivity::class.java))
        }

        rvRequests.layoutManager = LinearLayoutManager(requireContext())
        adapter = RequestAdapter(emptyList()) { request ->
            val intent = Intent(requireContext(), RequestDetailsActivity::class.java)
            intent.putExtra("request", request)
            startActivity(intent)
        }
        rvRequests.adapter = adapter
    }

    private fun fetchData() {
        RetrofitClient.instance.getAllRequests()
            .enqueue(object : Callback<List<BorrowingRequest>> {
                override fun onResponse(call: Call<List<BorrowingRequest>>, response: Response<List<BorrowingRequest>>) {
                    if (isAdded && response.isSuccessful) {
                        response.body()?.let { adapter.updateData(it) }
                    }
                }
                override fun onFailure(call: Call<List<BorrowingRequest>>, t: Throwable) {
                    if (isAdded) Toast.makeText(requireContext(), "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
    }
}
