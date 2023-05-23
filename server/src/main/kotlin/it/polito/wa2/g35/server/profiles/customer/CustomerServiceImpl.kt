package it.polito.wa2.g35.server.profiles.customer

import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class CustomerServiceImpl(private val profileRepository: CustomerRepository) : CustomerService {

    override fun getCustomerByEmail(email: String): CustomerDTO? {
        val profile = profileRepository.findByIdOrNull(email)?.toDTO()
        if(profile != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
                if (profile.email != authentication.name)
                    throw UnauthorizedProfileException("You can't access this profile!")
            }
            return profile
        } else {
            throw ProfileNotFoundException("Profile with given email doesn't exist!")
        }
    }

    override fun createCustomer(profile: CustomerDTO?): CustomerDTO? {
        return if (profile != null) {
            val checkIfProfileExists = profileRepository.findByIdOrNull(profile.email)
            if(checkIfProfileExists == null) {
                profileRepository.save(Customer(profile.email, profile.name, profile.surname)).toDTO()
            } else {
                throw DuplicateProfileException("Profile with given email already exists!")
            }
        } else
            null
    }

    override fun updateCustomer(profile: CustomerDTO?): CustomerDTO? {
        return if(profile != null) {
            val checkIfProfileExists = profileRepository.findByIdOrNull(profile.email)
            if (checkIfProfileExists != null) {
                val authentication = SecurityContextHolder.getContext().authentication
                if(authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE){
                    if (profile.email != authentication.name)
                        throw UnauthorizedProfileException("You can't access this profile!")
                }
                profileRepository.save(Customer(profile.email, profile.name, profile.surname)).toDTO()
            } else {
                throw ProfileNotFoundException("Profile with given email doesn't exists!")
            }
        } else {
            null
        }
    }
}