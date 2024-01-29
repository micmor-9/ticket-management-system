package it.polito.wa2.g35.server.profiles.customer

import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import org.keycloak.admin.client.CreatedResponseUtil
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import java.util.*
import javax.mail.Message
import javax.mail.PasswordAuthentication
import javax.mail.Session
import javax.mail.Transport
import javax.mail.internet.InternetAddress
import javax.mail.internet.MimeMessage
import kotlin.collections.ArrayList
import kotlin.random.Random

@Service
class CustomerServiceImpl(private val profileRepository: CustomerRepository) : CustomerService {
    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var keycloakUrlIssuer: String

    @Value("\${spring.security.oauth2.resourceserver.jwt.resource-id}")
    final lateinit var resourceId: String

    @Value("\${keycloak.realm-name}")
    final lateinit var realmName: String

    @Value("\${keycloak.admin-username}")
    final lateinit var adminUsername: String

    @Value("\${keycloak.admin-password}")
    final lateinit var adminPassword: String

    private val log: Logger = LoggerFactory.getLogger(javaClass)
    override fun getCustomer(customerEmail: String): CustomerDTO? {
        val profile = profileRepository.findByEmail(customerEmail)?.toDTO()
        return if (profile != null) {
            log.info("Get Customer by Id from repository request successful")
            profile
        } else {
            null
        }
    }

    override fun getAllCustomers(): List<CustomerDTO>? {
        val profile = profileRepository.findAll().map { it.toDTO() }
        val authentication = SecurityContextHolder.getContext().authentication
        if (authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE) {
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
        if (profile != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            if (authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE) {
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

    fun generateRandomPassword(length: Int): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"
        return (1..length)
            .map { chars[Random.nextInt(chars.length)] }
            .joinToString("")
    }

    private fun sendPasswordEmail(email: String, password: String) {
        val smtpProperties = Properties()
        smtpProperties["mail.smtp.auth"] = "true"
        smtpProperties["mail.smtp.starttls.enable"] = "true"
        smtpProperties["mail.smtp.host"] = "smtp.gmail.com"
        smtpProperties["mail.smtp.port"] = "587"

        val session = Session.getInstance(smtpProperties, object : javax.mail.Authenticator() {
            override fun getPasswordAuthentication(): PasswordAuthentication {
                return PasswordAuthentication("frittycash@gmail.com", "ukpu nixg qrsn mvek")
            }
        })

        try {
            val message = MimeMessage(session)
            message.setFrom(InternetAddress("no-reply-support@example.com"))
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email))
            message.subject = "Your New Password"
            message.setText(
                "Dear User, the password associated to this email account: $email " + " is: " + "\n" +
                        " $password"
            )

            Transport.send(message)
        } catch (e: Exception) {
            e.printStackTrace()
            // Gestisci l'eccezione in base alle tue esigenze
        }
    }

    override fun createCustomer(profile: CustomerDTO?): CustomerDTO? {
        if (profile != null) {
            val checkIfProfileExists = profileRepository.findByEmail(profile.email)
            if (checkIfProfileExists == null) {
                log.info("Create Customer request successful (repository)")
                profileRepository.save(
                    Customer(
                        profile.id,
                        profile.email,
                        profile.name,
                        profile.surname,
                        profile.contact,
                        profile.address1,
                        profile.address2
                    )
                ).toDTO()
            } else {
                log.error("Profile with given email already exists!")
                throw DuplicateProfileException("Profile with given email already exists!")
            }
            val pwd = generateRandomPassword(10)
            val customerRepresentation = UserRepresentation().apply {
                firstName = profile.name
                lastName = profile.surname
                username = profile.email
                isEnabled = true
                email = profile.email
                isEmailVerified = true
            }

            val passwordCredentials = ArrayList<CredentialRepresentation>()
            val passwordCredential = CredentialRepresentation().apply {
                type = CredentialRepresentation.PASSWORD
                value = pwd
                isTemporary = false
            }
            passwordCredentials.add(passwordCredential)
            customerRepresentation.credentials = passwordCredentials

            val keycloak: Keycloak = Keycloak.getInstance(
                "http://host.docker.internal:8080",
                "master",
                adminUsername,
                adminPassword,
                "admin-cli"
            )

            val realmResource = keycloak.realm(realmName)

            try {
                val customerResource = realmResource.users()
                val customers = customerResource.search(profile.email)
                if (customers.isNotEmpty()) {
                    log.error("Customer already exists!")
                    throw DuplicateProfileException("Customer already exists!")
                }
                val response = customerResource.create(customerRepresentation)
                val userId = CreatedResponseUtil.getCreatedId(response)
                val user = customerResource.get(userId)

                val roleRepresentation = realmResource.roles().get("app_client").toRepresentation()
                val rolesResource = user.roles()
                rolesResource.realmLevel().add(listOf(roleRepresentation))
                try {
                    // Invia l'email con la password al nuovo utente
                    sendPasswordEmail(profile.email, pwd)
                    return CustomerDTO(
                        profile.id,
                        profile.email,
                        profile.name,
                        profile.surname,
                        profile.contact,
                        profile.address1,
                        profile.address2
                    )
                } catch (e: Exception) {
                    // Gestisci l'eccezione in base alle tue esigenze
                    return null
                }
            } catch (e: RuntimeException) {
                return null
            }
        } else {
            log.error("Create Customer request failed")
            return null
        }
    }

    override fun updateCustomer(profile: CustomerDTO?): CustomerDTO? {
        return if (profile != null) {
            val checkIfProfileExists = profileRepository.findByEmail(profile.email)
            if (checkIfProfileExists != null) {
                val authentication = SecurityContextHolder.getContext().authentication
                if (authentication.authorities.map { it.authority }[0] == SecurityConfig.CLIENT_ROLE) {
                    if (profile.email != authentication.name) {
                        log.error("Update Customer request failed by unauthorized access")
                        throw UnauthorizedProfileException("You can't access this profile!")
                    }
                }
                log.info("Update Customer request successful (repository)")
                profileRepository.save(
                    Customer(
                        profile.id,
                        profile.email,
                        profile.name,
                        profile.surname,
                        profile.contact,
                        profile.address1,
                        profile.address2
                    )
                ).toDTO()
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