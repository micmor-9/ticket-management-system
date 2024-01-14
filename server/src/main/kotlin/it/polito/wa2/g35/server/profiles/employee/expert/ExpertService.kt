package it.polito.wa2.g35.server.profiles.employee.expert

interface ExpertService {
    fun getExpertById(expertId: String?): ExpertDTO?

    fun getExpert(expertEmail: String?): ExpertDTO?

    fun getExpertBySpecialization(specialization: String?): List<ExpertDTO>

    fun getExpertsSpecializations(): List<String>

    fun createExpert(expert: ExpertDTO): ExpertDTO?

    fun getAll(): List<ExpertDTO>?
}