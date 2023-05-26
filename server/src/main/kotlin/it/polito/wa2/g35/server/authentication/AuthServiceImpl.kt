package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.DuplicateProfileException
import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertDTO
import org.keycloak.admin.client.CreatedResponseUtil
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service

@Service
class AuthServiceImpl {

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var keycloakUrlIssuer: String

    @Value("\${http://localhost:8080/realms/SpringBootKeycloak/protocol/openid-connect/auth}")
    lateinit var keycloakUrl: String

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

    var  keycloak: Keycloak = Keycloak.getInstance(
        "http://localhost:8080",
        "master",
        adminUsername,
        adminPassword,
        "admin-cli"
    )
    fun signupCustomer(signupRequest: SignupCustomerRequest): CustomerDTO? {
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
        val customerDTO = CustomerDTO (
            signupRequest.email,
            signupRequest.name,
            signupRequest.surname
        )

        try {
            val userResource = realmResource.users()
            val users = userResource.search(signupRequest.email)
            if (users.isNotEmpty()) {
                throw DuplicateProfileException("Customer already exists!")
            }
            val response = userResource.create(userRepresentation) // Effettua la creazione dell'utente
            val userId = CreatedResponseUtil.getCreatedId(response) // Ottieni l'ID dell'utente creato
            val user = userResource.get(userId)

            val roleRepresentation = realmResource.roles().get("app_client").toRepresentation()
            val rolesResource = user.roles()
            rolesResource.realmLevel().add(listOf(roleRepresentation))
        } catch (e: RuntimeException) {
            return null
        }
        customerService.createCustomer(customerDTO)
        return customerDTO
    }

    fun signupExpert(request: SignupExpertRequest): ExpertDTO? {
        TODO()
    }

    fun login(request: AuthRequest): AuthResponse? {
        TODO()
    }
}