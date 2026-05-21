package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.contract.DashboardContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.presenter.DashboardPresenter

class DashboardFragment : Fragment(), DashboardContract.View {

    private lateinit var presenter: DashboardContract.Presenter
    private lateinit var adapter: RequestAdapter
    private lateinit var rvRequests: RecyclerView
    private lateinit var tvEmptyRequests: TextView
    private lateinit var tvStatActive: TextView
    private lateinit var tvStatOngoing: TextView
    private lateinit var tvStatReturned: TextView

    private val createRequestLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == AppCompatActivity.RESULT_OK) {
            presenter.loadDashboardData() 
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_dashboard, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        presenter = DashboardPresenter(this)
        
        setupUI(view)
        presenter.start()
    }

    private fun setupUI(view: View) {
        val tvWelcome = view.findViewById<TextView>(R.id.tvWelcome)
        rvRequests = view.findViewById(R.id.rvRequests)
        tvEmptyRequests = view.findViewById(R.id.tvEmptyRequests)
        
        tvStatActive = view.findViewById(R.id.tvStatActiveRequests)
        tvStatOngoing = view.findViewById(R.id.tvStatOngoingTransactions)
        tvStatReturned = view.findViewById(R.id.tvStatReturnedTransactions)

        val cardActive = view.findViewById<View>(R.id.cardActiveRequests)
        val cardOngoing = view.findViewById<View>(R.id.cardOngoingTransactions)
        val cardReturned = view.findViewById<View>(R.id.cardReturnedTransactions)

        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        val fullName = sharedPref.getString("full_name", "User")

        tvWelcome.text = "Welcome, ${fullName?.split(" ")?.get(0)}!"

        val bottomNav = requireActivity().findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.bottom_navigation)

        cardActive.setOnClickListener {
            bottomNav.selectedItemId = R.id.nav_requests
        }
        cardOngoing.setOnClickListener {
            bottomNav.selectedItemId = R.id.nav_transactions
        }
        cardReturned.setOnClickListener {
            bottomNav.selectedItemId = R.id.nav_transactions
        }

        val btnCreate = view.findViewById<android.widget.Button>(R.id.btnDashboardCreateRequest)
        btnCreate.setOnClickListener {
            val intent = Intent(requireContext(), CreateRequestActivity::class.java)
            createRequestLauncher.launch(intent)
        }

        rvRequests.layoutManager = LinearLayoutManager(requireContext())

        adapter = RequestAdapter(emptyList()) { request ->
            val intent = Intent(requireContext(), RequestDetailsActivity::class.java)
            intent.putExtra("request", request)
            startActivity(intent)
        }
        rvRequests.adapter = adapter
    }

    override fun setPresenter(presenter: DashboardContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        if (!isAdded) return -1L
        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showStats(activeCount: Int, ongoingCount: Int, returnedCount: Int) {
        tvStatActive.text = activeCount.toString()
        tvStatOngoing.text = ongoingCount.toString()
        tvStatReturned.text = returnedCount.toString()
    }

    override fun showExplorerRequests(requests: List<BorrowingRequest>) {
        adapter.updateData(requests)
    }

    override fun showEmptyState(isEmpty: Boolean) {
        if (isEmpty) {
            tvEmptyRequests.visibility = View.VISIBLE
            rvRequests.visibility = View.GONE
        } else {
            tvEmptyRequests.visibility = View.GONE
            rvRequests.visibility = View.VISIBLE
        }
    }

    override fun showLoading() {
    }

    override fun hideLoading() {
    }

    override fun showError(message: String) {
        if (isAdded) Toast.makeText(requireContext(), message, Toast.LENGTH_SHORT).show()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        presenter.onDestroy()
    }
}
