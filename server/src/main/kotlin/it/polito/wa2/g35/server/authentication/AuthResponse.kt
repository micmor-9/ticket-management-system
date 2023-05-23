package it.polito.wa2.g35.server.authentication

data class AuthResponse(
    val access_token: String,
    val expires_in: Long,
    val refresh_expires_in: Long,
    val refresh_token: String,
    val token_type: String,
    val not_before_policy: Int,
    val session_state: String,
    val scope: String
)