package it.polito.wa2.g35.server.authentication

data class ChangePasswordRequest(
        val email: String,
        val oldPassword: String,
        val newPassword: String
)