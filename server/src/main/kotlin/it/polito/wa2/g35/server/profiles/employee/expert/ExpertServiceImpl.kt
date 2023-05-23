package it.polito.wa2.g35.server.profiles.employee.expert

import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(private val expertRepository: ExpertRepository) : ExpertService {
    override fun getExpertById(expertId: String?): ExpertDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val expert = expertRepository.findByIdOrNull(expertId)
            ?: throw UnauthorizedProfileException("Expert with given id doesn't exist!")

        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                expert.toDTO()
            }

            SecurityConfig.EXPERT_ROLE -> {
                if (authentication.name == expert.email) {
                    expert.toDTO()
                } else
                    throw UnauthorizedTicketException("You can't access this expert!")
            }
            else -> {
                throw UnauthorizedTicketException("You can't access this expert!")
            }
        }
    }

    override fun getExpertBySpecialization(specialization: String?): List<ExpertDTO> {
        return expertRepository.findBySpecialization(specialization).map { it.toDTO() }
    }

    override fun createExpert(expert: ExpertDTO): ExpertDTO? {
        val checkIfProfileExists = expertRepository.findByIdOrNull(expert.id)
        if (checkIfProfileExists == null) {
            return expertRepository.save(
                Expert(
                    expert.id,
                    expert.name,
                    expert.surname,
                    expert.email,
                    expert.specialization
                )
            ).toDTO()
        } else {
            throw DuplicateProfileException("Profile with given email already exists!")
        }

    }
}