package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.contract.MyRequestsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.presenter.MyRequestsPresenter

class MyRequestsFragment : Fragment(), MyRequestsContract.View {

    private lateinit var presenter: MyRequestsContract.Presenter
    private lateinit var activeAdapter: RequestAdapter
    private lateinit var pastAdapter: RequestAdapter
    private lateinit var rvActive: RecyclerView
    private lateinit var rvPast: RecyclerView
    private lateinit var tvEmptyActive: android.widget.TextView
    private lateinit var tvEmptyPast: android.widget.TextView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_my_requests, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        presenter = MyRequestsPresenter(this)
        
        setupUI(view)
        presenter.start()
    }

    private fun setupUI(view: View) {
        rvActive = view.findViewById(R.id.rvActiveRequests)
        rvPast = view.findViewById(R.id.rvPastRequests)
        tvEmptyActive = view.findViewById(R.id.tvEmptyActiveRequests)
        tvEmptyPast = view.findViewById(R.id.tvEmptyPastRequests)

        rvActive.layoutManager = LinearLayoutManager(requireContext())
        rvPast.layoutManager = LinearLayoutManager(requireContext())

        activeAdapter = RequestAdapter(emptyList()) { request ->
            openDetails(request)
        }

        pastAdapter = RequestAdapter(emptyList()) { request ->
            openDetails(request)
        }

        rvActive.adapter = activeAdapter
        rvPast.adapter = pastAdapter
    }

    private fun openDetails(request: BorrowingRequest) {
        val intent = Intent(requireContext(), RequestDetailsActivity::class.java)
        intent.putExtra("request", request)
        startActivity(intent)
    }

    override fun setPresenter(presenter: MyRequestsContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        if (!isAdded) return -1L
        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showActiveRequests(requests: List<BorrowingRequest>) {
        activeAdapter.updateData(requests)
    }

    override fun showPastRequests(requests: List<BorrowingRequest>) {
        pastAdapter.updateData(requests)
    }

    override fun showEmptyActiveState(isEmpty: Boolean) {
        if (isEmpty) {
            tvEmptyActive.visibility = View.VISIBLE
            rvActive.visibility = View.GONE
        } else {
            tvEmptyActive.visibility = View.GONE
            rvActive.visibility = View.VISIBLE
        }
    }

    override fun showEmptyPastState(isEmpty: Boolean) {
        if (isEmpty) {
            tvEmptyPast.visibility = View.VISIBLE
            rvPast.visibility = View.GONE
        } else {
            tvEmptyPast.visibility = View.GONE
            rvPast.visibility = View.VISIBLE
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
