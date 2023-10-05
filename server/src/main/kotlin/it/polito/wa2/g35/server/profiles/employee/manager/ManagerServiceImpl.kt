package it.polito.wa2.g35.server.profiles.employee.manager

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.toExpert
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ManagerServiceImpl(
    private val managerRepository: ManagerRepository
) : ManagerService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @Autowired
    lateinit var expertService: ExpertService
    @Autowired
    lateinit var customerService: CustomerService

    @Observed(
        name = "/managers/{managerEmail}",
        contextualName = "get-manager-id-request-service"
    )
    override fun getManager(managerEmail: String?): ManagerDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val manager = managerRepository.findByEmail(managerEmail)
        if (manager == null) {
            log.error("No manager found with this email: $managerEmail")
            throw ProfileNotFoundException("Manager with given id doesn't exist!")
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
        name = "/users/{email}",
        contextualName = "get-username-by-email-request-service"
    )
    override fun getUsernameByEmail(email: String): String? {
        val manager = managerRepository.findByEmail(email)
        if (manager != null) {
            return manager.name + " " + manager.surname
        }

        val expert = expertService.getExpert(email)?.toExpert()
        if (expert != null) {
            return expert.name + " " + expert.surname
        }

        val customer = customerService.getCustomer(email)?.toCustomer()
        if (customer != null) {
            return customer.name + " " + customer.surname
        }

        log.error("No user found with this email: $email")
        throw ProfileNotFoundException("User with given email doesn't exist!")
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