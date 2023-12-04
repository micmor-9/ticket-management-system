package it.polito.wa2.g35.server.profiles.employee.manager

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.toDTO
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
    private val log: Logger = LoggerFactory.getLogger(javaClass)

    @Autowired
    lateinit var customerService: CustomerService

    @Observed(
        name = "/managers/{managerEmail}",
        contextualName = "get-manager-id-request-service"
    )
    override fun getManager(managerEmail: String?): ManagerDTO? {
        val manager = managerRepository.findByEmail(managerEmail)
        return if (manager == null) {
            null
        } else {
            log.info("Get manager by id from repository request successful")
            manager.toDTO()
        }
    }

    @Observed(
        name = "/managers/",
        contextualName = "get-managers-request-service"
    )
    override fun getAllManagers(): List<ManagerDTO> {
        val managers = managerRepository.findAll()
        return managers.map { it.toDTO() }
    }
}