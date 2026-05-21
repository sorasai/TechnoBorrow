package com.example.technoborrowapp.features.dashboard.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.dashboard.contract.DashboardActivityContract
import com.example.technoborrowapp.features.dashboard.presenter.DashboardActivityPresenter
import com.example.technoborrowapp.features.profile.ui.ProfileActivity
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.floatingactionbutton.FloatingActionButton

class DashboardActivity : AppCompatActivity(), DashboardActivityContract.View {

    private lateinit var presenter: DashboardActivityContract.Presenter
    private lateinit var ivAvatar: ImageView

    private val createRequestLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        if (result.resultCode == RESULT_OK) {
            val currentFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment)
            if (currentFragment is DashboardFragment) {
                loadFragment(DashboardFragment())
            } else if (currentFragment is MyRequestsFragment) {
                loadFragment(MyRequestsFragment())
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)

        presenter = DashboardActivityPresenter(this)
        setupUI()
        presenter.start()
        
        loadFragment(DashboardFragment())
    }

    private fun setupUI() {
        ivAvatar = findViewById(R.id.ivToolbarAvatar)
        val fabCreate = findViewById<FloatingActionButton>(R.id.fabCreateRequest)
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_navigation)

        ivAvatar.setOnClickListener {
            startActivity(Intent(this, ProfileActivity::class.java))
        }

        fabCreate.setOnClickListener {
            createRequestLauncher.launch(Intent(this, CreateRequestActivity::class.java))
        }

        bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_dashboard -> {
                    loadFragment(DashboardFragment())
                    true
                }
                R.id.nav_requests -> {
                    loadFragment(MyRequestsFragment())
                    true
                }
                R.id.nav_transactions -> {
                    loadFragment(MyTransactionsFragment())
                    true
                }
                R.id.nav_profile -> {
                    startActivity(Intent(this, ProfileActivity::class.java))
                    false
                }
                else -> false
            }
        }
    }

    override fun setPresenter(presenter: DashboardActivityContract.Presenter) {
        this.presenter = presenter
    }

    override fun getUserId(): Long {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        return sharedPref.getLong("user_id", -1L)
    }

    override fun showAvatar(base64Image: String) {
        try {
            val decodedString = android.util.Base64.decode(base64Image, android.util.Base64.DEFAULT)
            val bitmap = android.graphics.BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            ivAvatar.setImageBitmap(bitmap)
        } catch (e: Exception) {}
    }

    override fun showLoading() {
    }

    override fun hideLoading() {
    }

    override fun showError(message: String) {
    }

    private fun loadFragment(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction.replace(R.id.nav_host_fragment, fragment)
        transaction.commit()
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }
}
