package it.polito.wa2.g35.server.profiles.employee.expert

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ExpertServiceImpl(private val expertRepository: ExpertRepository) : ExpertService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @Observed(
        name = "/experts/{expertId}",
        contextualName = "get-expert-by-id-request-service"
    )
    override fun getExpertById(expertId: String?): ExpertDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val expert = expertRepository.findByIdOrNull(expertId)
        if (expert == null) {
            log.error("No Expert found with this Id: $expertId")
            throw UnauthorizedProfileException("Expert with given id doesn't exist!")
        }

        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Get expert by id from repository request successful")
                expert.toDTO()
            }

            SecurityConfig.EXPERT_ROLE -> {
                if (authentication.name == expert.email) {
                    log.info("Get expert by id from repository request successful")
                    expert.toDTO()
                } else {
                    log.error("Get expert by Id request failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this expert!")
                }
            }

            else -> {
                log.error("Get expert by Id request failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access this expert!")
            }
        }
    }

    @Observed(
        name = "/experts",
        contextualName = "get-experts-request-service"
    )
    override fun getAll(): List<ExpertDTO>? {
        log.info("Get all experts from repository request successful")
        return expertRepository.findAll().map { it.toDTO() }
    }

    @Observed(
        name = "/experts/id/{expertEmail}",
        contextualName = "get-expert-id-by-email-request-service"
    )
    override fun getExpert(expertEmail: String?): ExpertDTO? {
        val expert = expertRepository.findByEmail(expertEmail)
        return if (expert == null) {
            null
        } else {
            log.info("Get expert id from repository request successful")
            expert.toDTO()
        }
    }

    @Observed(
        name = "/experts/specialization/{specialization}",
        contextualName = "get-expert-by-specialization-request-service"
    )
    override fun getExpertBySpecialization(specialization: String?): List<ExpertDTO> {
        log.info("Get expert by specialization from repository request successful")
        return expertRepository.findBySpecialization(specialization).map { it.toDTO() }
    }

    @Observed(
        name = "/experts/specialization/{specialization}",
        contextualName = "post-expert-request-service"
    )
    override fun createExpert(expert: ExpertDTO): ExpertDTO? {
        var checkIfProfileExists = expertRepository.findByEmail(expert.email)
        if (checkIfProfileExists == null) {
            checkIfProfileExists = expertRepository.findByIdOrNull(expert.id)
            if (checkIfProfileExists != null) {
                log.error("Profile with given id already exists!")
                throw DuplicateProfileException("Profile with given id already exists!")
            }
            log.info("Create expert request successful (repository)")
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
            log.error("Profile with given email already exists!")
            throw DuplicateProfileException("Profile with given email already exists!")
        }

    }

    @Observed(
        name = "/experts/specializations/",
        contextualName = "get-expert-specializations-request-service"
    )
    override fun getExpertsSpecializations(): List<String> {
        log.info("Get experts specializations from repository request successful")
        return expertRepository.findAll().map { it.specialization }.distinct()
    }
}