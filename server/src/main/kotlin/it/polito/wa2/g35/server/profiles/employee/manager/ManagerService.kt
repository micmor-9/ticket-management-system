package it.polito.wa2.g35.server.profiles.employee.manager

interface ManagerService {
    fun getManagerId(managerEmail: String?) : ManagerDTO?

    fun getAllManagers(): List<ManagerDTO>?
}