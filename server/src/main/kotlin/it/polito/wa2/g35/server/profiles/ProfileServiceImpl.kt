package it.polito.wa2.g35.server.profiles

import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.manager.ManagerService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class ProfileServiceImpl : ProfileService {
    @Autowired
    lateinit var expertService: ExpertService

    @Autowired
    lateinit var managerService: ManagerService

    @Autowired
    lateinit var customerService: CustomerService

    override fun getUserIdByEmail(email: String): String? {
        val expert = expertService.getExpert(email)
        if (expert != null) {
            return expert.id
        }

        val manager = managerService.getManager(email)
        if (manager != null) {
            return manager.id
        }

        val customer = customerService.getCustomer(email)
        if (customer != null) {
            return customer.id.toString()
        }

        throw ProfileNotFoundException("No user found with this email: $email")
    }
}