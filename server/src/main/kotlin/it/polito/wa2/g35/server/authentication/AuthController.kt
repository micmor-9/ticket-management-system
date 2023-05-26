package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import org.keycloak.admin.client.CreatedResponseUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.keycloak.admin.client.Keycloak
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.util.MultiValueMap
import org.springframework.http.HttpStatus



@RestController
class AuthController {

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

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: AuthRequest): ResponseEntity<AuthResponse> {
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
            return ResponseEntity.ok(tokenResponse)
        } catch (e: Exception) {
            throw InvalidUserCredentialsException("Invalid username or password!")
        }
    }


    @PostMapping("/signup")
    fun signup(@RequestBody signupRequest: SignupRequest): ResponseEntity<String> {

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

        var keycloak: Keycloak = Keycloak.getInstance(
            "http://localhost:8080",
            "master",
            adminUsername,
            adminPassword,
            "admin-cli"
        )

        val realmResource = keycloak.realm(realmName)
        val customerDTO = CustomerDTO (
            signupRequest.email,
            signupRequest.name,
            signupRequest.surname
        )

        try {
            val userResource = realmResource.users()
            val response = userResource.create(userRepresentation) // Effettua la creazione dell'utente
            val userId = CreatedResponseUtil.getCreatedId(response) // Ottieni l'ID dell'utente creato
            val user = userResource.get(userId)

            val roleRepresentation = realmResource.roles().get("app_client").toRepresentation()
            val rolesResource = user.roles()
            rolesResource.realmLevel().add(listOf(roleRepresentation))

            customerService.createCustomer(customerDTO)
            return ResponseEntity.ok("User created successfully!")
        } catch (e: RuntimeException) {
            println(e.message)
            return ResponseEntity("Problem during registration!", HttpStatus.BAD_REQUEST)
        }


    }
}