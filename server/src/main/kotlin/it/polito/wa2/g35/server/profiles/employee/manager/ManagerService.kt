package it.polito.wa2.g35.server.profiles.employee.manager

interface ManagerService {
    fun getManager(managerEmail: String?) : ManagerDTO?

    fun getUsernameByEmail(email: String) : String?
}