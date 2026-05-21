package com.example.technoborrowapp.features.auth.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.technoborrowapp.MainActivity
import com.example.technoborrowapp.R
import com.example.technoborrowapp.features.auth.contract.LoginContract
import com.example.technoborrowapp.features.auth.data.model.User
import com.example.technoborrowapp.features.auth.presenter.LoginPresenter

class LoginActivity : AppCompatActivity(), LoginContract.View {

    private lateinit var presenter: LoginContract.Presenter
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize Presenter
        presenter = LoginPresenter(this)

        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        val btnLogin = findViewById<Button>(R.id.btnLogin)
        val tvRegister = findViewById<TextView>(R.id.tvRegister)

        tvRegister?.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()
            presenter.login(email, password)
        }
    }

    override fun setPresenter(presenter: LoginContract.Presenter) {
        this.presenter = presenter
    }

    override fun showLoading() {
        // You could add a ProgressBar to the layout and show it here
        Toast.makeText(this, "Logging in...", Toast.LENGTH_SHORT).show()
    }

    override fun hideLoading() {
        // Hide ProgressBar
    }

    override fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    override fun navigateToDashboard() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    override fun showLoginSuccess(user: User) {
        Toast.makeText(this, "Welcome, ${user.fullName}", Toast.LENGTH_SHORT).show()
    }

    override fun saveSession(user: User) {
        val sharedPref = getSharedPreferences("technoborrow", Context.MODE_PRIVATE)
        with(sharedPref.edit()) {
            putLong("user_id", user.id ?: -1L)
            putString("user_email", user.email)
            putString("full_name", user.fullName)
            apply()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        presenter.onDestroy()
    }
}
