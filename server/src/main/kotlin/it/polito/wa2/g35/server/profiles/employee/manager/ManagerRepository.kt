package it.polito.wa2.g35.server.profiles.employee.manager

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ManagerRepository : JpaRepository<Manager, String>