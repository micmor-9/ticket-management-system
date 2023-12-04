package it.polito.wa2.g35.server.profiles

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.toExpert
import it.polito.wa2.g35.server.profiles.employee.manager.ManagerService
import it.polito.wa2.g35.server.profiles.employee.manager.toManager
import it.polito.wa2.g35.server.security.SecurityConfig
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ProfileServiceImpl : ProfileService {
    private val log: Logger = LoggerFactory.getLogger(javaClass)

    @Autowired
    lateinit var expertService: ExpertService

    @Autowired
    lateinit var managerService: ManagerService

    @Autowired
    lateinit var customerService: CustomerService

    override fun getUserIdByEmail(email: String): String? {
        val authentication = SecurityContextHolder.getContext().authentication

        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                val manager = managerService.getManager(email)
                if (manager != null) {
                    return manager.id
                } else {
                    throw ProfileNotFoundException("No manager found with this email: $email")
                }
            }

            SecurityConfig.EXPERT_ROLE -> {
                val expert = expertService.getExpert(email)
                if (expert != null) {
                    return expert.id
                } else {
                    throw ProfileNotFoundException("No expert found with this email: $email")
                }
            }

            SecurityConfig.CLIENT_ROLE -> {
                val customer = customerService.getCustomer(email)
                if (customer != null) {
                    return customer.id.toString()
                } else {
                    throw ProfileNotFoundException("No customer found with this email: $email")
                }
            }

            else -> {
                throw ProfileNotFoundException("No user found with this email: $email")
            }
        }
    }

    @Observed(
        name = "/users/{email}",
        contextualName = "get-username-by-email-request-service"
    )
    override fun getUsernameByEmail(email: String): String? {
        try {
            val manager = managerService.getManager(email)
            val expert = expertService.getExpert(email)
            val customer = customerService.getCustomer(email)
            if (manager != null) {
                return manager.name + " " + manager.surname
            }
            if (expert != null) {
                return expert.name + " " + expert.surname
            }
            if (customer != null) {
                return customer.name + " " + customer.surname
            }
        } catch (_: ProfileNotFoundException) {
        }
        throw ProfileNotFoundException("No user found with this email: $email")
    }
}