package it.polito.wa2.g35.server.authentication

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertDTO
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertServiceImpl
import org.keycloak.admin.client.CreatedResponseUtil
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.admin.client.resource.UsersResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate
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
class AuthServiceImpl() : AuthService {

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

    @Autowired
    lateinit var customerService: CustomerServiceImpl

    @Autowired
    lateinit var expertService: ExpertServiceImpl

    private val log: Logger = LoggerFactory.getLogger(javaClass)


    private fun getUserResource(): UsersResource {
        val keycloak: Keycloak = Keycloak.getInstance(
            "http://host.docker.internal:8080",
            "master",
            adminUsername,
            adminPassword,
            "admin-cli"
        )
        val realmResource: RealmResource = keycloak.realm(realmName)
        return realmResource.users()
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

    fun generateRandomPassword(length: Int): String {
        val chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?"
        return (1..length)
            .map { chars[Random.nextInt(chars.length)] }
            .joinToString("")
    }

    override fun changePassword(request: ChangePasswordRequest): Boolean {
        println(request.newPassword)
        val userResource = getUserResource()
        val user = userResource.search(request.email).firstOrNull()
        if (user != null) {
            val authRequest = AuthRequest(
                username = request.email,
                password = request.oldPassword
            )
            val loginResult = login(authRequest)
            if (loginResult != null) {
                println(request.newPassword)

                val credentialRepresentation = CredentialRepresentation().apply {
                    type = CredentialRepresentation.PASSWORD
                    value = request.newPassword
                }

                userResource.get(user.id).resetPassword(credentialRepresentation)

                return true
            }
            return false
        }
        return false
    }

    override fun resetPassword(email: String): Boolean {
        val userResource = getUserResource()
        val user = userResource.search(email).firstOrNull()
        if (user != null) {
            val newPassword = generateRandomPassword(12)


            val credentialRepresentation = CredentialRepresentation().apply {
                type = CredentialRepresentation.PASSWORD
                value = newPassword
            }
            userResource.get(user.id).resetPassword(credentialRepresentation)

            sendPasswordEmail(email, newPassword)

            return true
        }
        return false
    }

    @Observed(
        name = "signup",
        contextualName = "signup-request"
    )
    override fun signupCustomer(signupRequest: SignupCustomerRequest): CustomerDTO? {
        val keycloak: Keycloak = Keycloak.getInstance(
            "http://host.docker.internal:8080",
            "master",
            adminUsername,
            adminPassword,
            "admin-cli"
        )
        val userRepresentation = UserRepresentation().apply {
            firstName = signupRequest.name
            lastName = signupRequest.surname
            username = signupRequest.email
            isEnabled = true
            email = signupRequest.email
            isEmailVerified = true
        }
        val passwordCredentials = ArrayList<CredentialRepresentation>()
        val passwordCredential = CredentialRepresentation().apply {
            type = CredentialRepresentation.PASSWORD
            value = signupRequest.password
            isTemporary = false
        }
        passwordCredentials.add(passwordCredential)
        userRepresentation.credentials = passwordCredentials

        val realmResource = keycloak.realm(realmName)
        val customerDTO = CustomerDTO(
            null,
            signupRequest.email,
            signupRequest.name,
            signupRequest.surname,
            signupRequest.contact,
            signupRequest.address1,
            signupRequest.address2
        )

        try {
            val userResource = realmResource.users()
            val users = userResource.search(signupRequest.email)
            if (users.isNotEmpty()) {
                log.error("Customer already exists! $users")
                throw DuplicateProfileException("Customer already exists!")
            }
            val response = userResource.create(userRepresentation) // Effettua la creazione dell'utente
            val userId = CreatedResponseUtil.getCreatedId(response) // Ottieni l'ID dell'utente creato
            val user = userResource.get(userId)

            val roleRepresentation = realmResource.roles().get("app_client").toRepresentation()
            val rolesResource = user.roles()
            rolesResource.realmLevel().add(listOf(roleRepresentation))
        } catch (e: RuntimeException) {
            log.error("Error creating customer! ${e.message}")
            return null
        }
        log.info("Customer created! $customerDTO")
        return customerDTO
    }

    override fun signupExpert(signupRequest: SignupExpertRequest): ExpertDTO? {
        val pwd = generateRandomPassword(10)
        val expertRepresentation = UserRepresentation().apply {

            firstName = signupRequest.name
            lastName = signupRequest.surname
            username = signupRequest.email
            isEnabled = true
            email = signupRequest.email
            isEmailVerified = true
        }

        val passwordCredentials = ArrayList<CredentialRepresentation>()
        val passwordCredential = CredentialRepresentation().apply {
            type = CredentialRepresentation.PASSWORD
            value = pwd
            isTemporary = false
        }
        passwordCredentials.add(passwordCredential)
        expertRepresentation.credentials = passwordCredentials

        val keycloak: Keycloak = Keycloak.getInstance(
            "http://host.docker.internal:8080",
            "master",
            adminUsername,
            adminPassword,
            "admin-cli"
        )

        val realmResource = keycloak.realm(realmName)

        val expertDTO = ExpertDTO(
            signupRequest.id,
            signupRequest.name,
            signupRequest.surname,
            signupRequest.email,
            signupRequest.specialization
        )
        println(expertDTO)

        try {
            val expertResource = realmResource.users()
            val experts = expertResource.search(signupRequest.email)
            if (experts.isNotEmpty()) {
                return null
            }
            val response = expertResource.create(expertRepresentation)
            val userId = CreatedResponseUtil.getCreatedId(response)
            val user = expertResource.get(userId)

            val roleRepresentation = realmResource.roles().get("app_expert").toRepresentation()
            val rolesResource = user.roles()
            roleRepresentation.attributes["specialization"] = listOf(signupRequest.specialization)
            rolesResource.realmLevel().add(listOf(roleRepresentation))
            try {
                // Invia l'email con la password al nuovo utente
                sendPasswordEmail(signupRequest.email, pwd)
            } catch (e: Exception) {
                // Gestisci l'eccezione in base alle tue esigenze
            }
        } catch (e: RuntimeException) {
            return null
        }
        expertService.createExpert(expertDTO)
        return expertDTO
    }

    override fun login(loginRequest: AuthRequest): AuthResponse? {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val requestBody: MultiValueMap<String, String> = LinkedMultiValueMap()
        requestBody.add("grant_type", "password")
        requestBody.add("client_id", resourceId)
        requestBody.add("username", loginRequest.username)
        requestBody.add("password", loginRequest.password)

        val requestEntity = HttpEntity(requestBody, headers)

        val keycloakUrlTokenRequest = "$keycloakUrlIssuer/protocol/openid-connect/token"

        try {
            val tokenResponse: AuthResponse? = RestTemplate().exchange(
                keycloakUrlTokenRequest,
                HttpMethod.POST,
                requestEntity,
                AuthResponse::class.java
            ).body
            return tokenResponse
        } catch (e: Exception) {
            return null
        }
    }

    override fun refreshToken(refreshTokenRequest: RefreshTokenRequest): AuthResponse? {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val requestBody: MultiValueMap<String, String> = LinkedMultiValueMap()
        requestBody.add("grant_type", "refresh_token")
        requestBody.add("client_id", resourceId)
        requestBody.add("refresh_token", refreshTokenRequest.refresh_token)

        val requestEntity = HttpEntity(requestBody, headers)

        val keycloakUrlTokenRequest = "$keycloakUrlIssuer/protocol/openid-connect/token"

        try {
            val tokenResponse: AuthResponse? = RestTemplate().exchange(
                keycloakUrlTokenRequest,
                HttpMethod.POST,
                requestEntity,
                AuthResponse::class.java
            ).body
            return tokenResponse
        } catch (e: Exception) {
            return null
        }
    }
}