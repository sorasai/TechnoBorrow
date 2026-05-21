package com.example.technoborrowapp.core.ui

interface BaseView<T : BasePresenter> {
    fun setPresenter(presenter: T)
    fun showLoading()
    fun hideLoading()
    fun showError(message: String)
}
