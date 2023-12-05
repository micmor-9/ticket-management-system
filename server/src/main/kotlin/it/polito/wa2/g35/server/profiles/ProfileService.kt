package it.polito.wa2.g35.server.profiles

interface ProfileService {
    fun getUserIdByEmail(email: String): String?
    fun getUsernameByEmail(email: String): String?
}