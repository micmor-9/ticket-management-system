package it.polito.wa2.g35.server.authentication

data class SignupExpertRequest (
    val id: String,
    val email: String,
    val name: String,
    val surname: String,
    val specialization: String
)
