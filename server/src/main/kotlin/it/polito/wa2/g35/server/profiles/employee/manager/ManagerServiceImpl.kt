package it.polito.wa2.g35.server.profiles.employee.manager

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ManagerServiceImpl(private val managerRepository: ManagerRepository) : ManagerService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @Observed(
        name = "/managers/{managerEmail}",
        contextualName = "get-manager-id-request-service"
    )
    override fun getManagerId(managerEmail: String?): ManagerDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val manager = managerRepository.findByEmail(managerEmail)
        if (manager == null) {
            log.error("No manager found with this email: $managerEmail")
            throw UnauthorizedProfileException("Manager with given id doesn't exist!")
        }

        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Get manager by id from repository request successful")
                manager.toDTO()
            }

            SecurityConfig.EXPERT_ROLE -> {
                log.error("Get manager Id request failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access this manager!")
            }

            else -> {
                log.error("Get manager Id request failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access this manager!")
            }
        }
    }

    @Observed(
        name = "/managers/",
        contextualName = "get-managers-request-service"
    )
    override fun getAllManagers(): List<ManagerDTO>? {
        val authentication = SecurityContextHolder.getContext().authentication
        val managers = managerRepository.findAll()
        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Get manager by id from repository request successful")
                managers.map { it.toDTO() }
            }
            SecurityConfig.EXPERT_ROLE -> {
                log.info("Get manager by id from repository request successful")
                managers.map { it.toDTO() }
            }
            else -> {
                log.error("Get managers request failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access managers!")
            }
        }
    }
}