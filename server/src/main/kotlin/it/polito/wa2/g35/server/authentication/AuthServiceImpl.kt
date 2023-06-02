package it.polito.wa2.g35.server.authentication

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertDTO
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertServiceImpl
import org.keycloak.admin.client.CreatedResponseUtil
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestTemplate

@Service
class AuthServiceImpl() : AuthService  {

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

    private val log: Logger = LoggerFactory.getLogger(AuthController::class.java)

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
            signupRequest.email,
            signupRequest.name,
            signupRequest.surname
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
        customerService.createCustomer(customerDTO)
        log.info("Customer created! $customerDTO")
        return customerDTO
    }

    override fun signupExpert(signupRequest: SignupExpertRequest): ExpertDTO? {
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
            value = signupRequest.password
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
            signupRequest.specialization,
            signupRequest.specialization
        )

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
}