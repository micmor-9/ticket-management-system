package it.polito.wa2.g35.server.authentication

data class SignupRequest (
    val email: String,
    val password: String,
    val name: String,
    val surname: String
)
