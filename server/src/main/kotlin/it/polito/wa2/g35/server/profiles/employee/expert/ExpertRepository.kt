package it.polito.wa2.g35.server.profiles.employee.expert

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ExpertRepository: JpaRepository<Expert, String>{
    fun findBySpecialization(specialization: String?): List<Expert>
}