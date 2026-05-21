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
import com.example.technoborrowapp.features.dashboard.contract.MyTransactionsContract
import com.example.technoborrowapp.features.dashboard.data.model.BorrowingRequest
import com.example.technoborrowapp.features.dashboard.presenter.MyTransactionsPresenter

class MyTransactionsFragment : Fragment(), MyTransactionsContract.View {

    private lateinit var presenter: MyTransactionsContract.Presenter
    private lateinit var ongoingAdapter: RequestAdapter
    private lateinit var pastAdapter: RequestAdapter
    private lateinit var rvOngoing: RecyclerView
    private lateinit var rvPast: RecyclerView
    private lateinit var tvEmptyOngoing: android.widget.TextView
    private lateinit var tvEmptyPast: android.widget.TextView

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_my_transactions, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        presenter = MyTransactionsPresenter(this)

        setupUI(view)
        presenter.start()
    }

    private fun setupUI(view: View) {
        rvOngoing = view.findViewById(R.id.rvOngoingTransactions)
        rvPast = view.findViewById(R.id.rvTransactionHistory)
        tvEmptyOngoing = view.findViewById(R.id.tvEmptyOngoingTransactions)
        tvEmptyPast = view.findViewById(R.id.tvEmptyTransactionHistory)

        rvOngoing.layoutManager = LinearLayoutManager(requireContext())
        rvPast.layoutManager = LinearLayoutManager(requireContext())

        ongoingAdapter = RequestAdapter(emptyList()) { request ->
            openDetails(request)
        }

        pastAdapter = RequestAdapter(emptyList()) { request ->
            openDetails(request)
        }

        rvOngoing.adapter = ongoingAdapter
        rvPast.adapter = pastAdapter
    }

    private fun openDetails(request: BorrowingRequest) {
        val intent = Intent(requireContext(), RequestDetailsActivity::class.java)
        intent.putExtra("request", request)
        startActivity(intent)
    }

    override fun setPresenter(presenter: MyTransactionsContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        if (!isAdded) return -1L
        val sharedPref = requireActivity().getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showOngoingTransactions(requests: List<BorrowingRequest>) {
        ongoingAdapter.updateData(requests)
    }

    override fun showPastTransactions(requests: List<BorrowingRequest>) {
        pastAdapter.updateData(requests)
    }

    override fun showEmptyOngoingState(isEmpty: Boolean) {
        if (isEmpty) {
            tvEmptyOngoing.visibility = View.VISIBLE
            rvOngoing.visibility = View.GONE
        } else {
            tvEmptyOngoing.visibility = View.GONE
            rvOngoing.visibility = View.VISIBLE
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


