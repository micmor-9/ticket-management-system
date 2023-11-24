package it.polito.wa2.g35.server.profiles.customer

import it.polito.wa2.g35.server.authentication.AuthService
import it.polito.wa2.g35.server.authentication.SignupCustomerRequest
import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CustomerServiceImpl(private val profileRepository: CustomerRepository) : CustomerService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    override fun getCustomer(customerEmail: String): CustomerDTO? {
        val profile = profileRepository.findByEmail(customerEmail)?.toDTO()
        if(profile != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
                if (profile.email != authentication.name) {
                    log.error("Get Customer by Id from repository request failed by unauthorized access")
                    throw UnauthorizedProfileException("You can't access this profile!")
                }
            }
            log.info("Get Customer by Id from repository request successful")
            return profile
        } else {
            log.error("Profile with given id doesn't exist!")
            throw ProfileNotFoundException("Profile with given id doesn't exist!")
        }
    }

    override fun getAllCustomers(): List<CustomerDTO>? {
        val profile = profileRepository.findAll().map { it.toDTO() }
        val authentication = SecurityContextHolder.getContext().authentication
        if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
            if (profile[0].email != authentication.name) {
                log.error("Get All Customers from repository request failed by unauthorized access")
                throw UnauthorizedProfileException("You can't access this profile!")
            }
        }
        log.info("Get All Customers from repository request successful")
        return profile
    }

    override fun getCustomerByEmail(email: String): CustomerDTO? {
        val profile = profileRepository.findByEmail(email)?.toDTO()
        if(profile != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
                if (profile.email != authentication.name) {
                    log.error("Get Customer by Email from repository request failed by unauthorized access")
                    throw UnauthorizedProfileException("You can't access this profile!")
                }
            }
            log.info("Get Customer by Email from repository request successful")
            return profile
        } else {
            log.error("Profile with given email doesn't exist!")
            throw ProfileNotFoundException("Profile with given email doesn't exist!")
        }
    }

    override fun createCustomer(profile: CustomerDTO?): CustomerDTO? {
        return if (profile != null) {
            val checkIfProfileExists = profileRepository.findByEmail(profile.email)
            if(checkIfProfileExists == null) {
                log.info("Create Customer request successful (repository)")
                profileRepository.save(Customer(profile.id,profile.email,profile.name,profile.surname,profile.contact,profile.address1,profile.address2)).toDTO()
            } else {
                log.error("Profile with given email already exists!")
                throw DuplicateProfileException("Profile with given email already exists!")
            }
        } else {
            log.error("Create Customer request failed")
            null
        }
    }

    override fun updateCustomer(profile: CustomerDTO?): CustomerDTO? {
        return if(profile != null) {
            val checkIfProfileExists = profileRepository.findByEmail(profile.email)
            if (checkIfProfileExists != null) {
                val authentication = SecurityContextHolder.getContext().authentication
                if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
                    if (profile.email != authentication.name) {
                        log.error("Update Customer request failed by unauthorized access")
                        throw UnauthorizedProfileException("You can't access this profile!")
                    }
                }
                log.info("Update Customer request successful (repository)")
                profileRepository.save(Customer(profile.id, profile.email, profile.name, profile.surname, profile.contact, profile.address1, profile.address2)).toDTO()
            } else {
                log.error("Profile with given email doesn't exists!")
                throw ProfileNotFoundException("Profile with given email doesn't exists!")
            }
        } else {
            log.error("Update Customer request failed")
            null
        }
    }


}