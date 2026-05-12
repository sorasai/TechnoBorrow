package com.example.technoborrowapp.core.ui

import android.content.Context
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Shader
import android.util.AttributeSet
import androidx.appcompat.widget.AppCompatTextView

class GradientTextView @JvmOverloads constructor(
    context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0
) : AppCompatTextView(context, attrs, defStyleAttr) {

    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        if (changed && width > 0) {
            paint.shader = LinearGradient(
                0f, 0f, width.toFloat(), 0f,
                intArrayOf(
                    Color.parseColor("#FF7A2F"),
                    Color.parseColor("#F4B41A"),
                    Color.parseColor("#FFD35A")
                ),
                floatArrayOf(0f, 0.6f, 1f),
                Shader.TileMode.CLAMP
            )
        }
    }
}
