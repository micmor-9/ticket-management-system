package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.util.MultiValueMap
import org.springframework.http.HttpStatus



@RestController
class AuthController {

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var keycloakUrlIssuer: String

    @Value("\${http://localhost:8080/realms/SpringBootKeycloak")
    lateinit var keycloakUrl: String

    @Value("\${spring.security.oauth2.resourceserver.jwt.resource-id}")
    final lateinit var clientId: String

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
        requestBody.add("client_id", clientId)
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
        /*var keycloak: Keycloak = Keycloak.getInstance(
            keycloakUrl,
            realmName,
            adminUsername,
            adminPassword,
            clientId
        )

        val realmResource: RealmResource = keycloak.realm(realmName)

        val userRepresentation = UserRepresentation().apply {
            firstName = signupRequest.name
            lastName = signupRequest.surname
            email = signupRequest.email
        }

        val credentialRepresentation = CredentialRepresentation().apply {
            type = CredentialRepresentation.PASSWORD
            value = signupRequest.password
            isTemporary = false
        }
        userRepresentation.credentials = listOf(credentialRepresentation)

        try {
            realmResource.users().create(userRepresentation)
        } catch (e : RuntimeException) {
            return ResponseEntity("Problem during registration!", HttpStatus.BAD_REQUEST)
        }

        val customerDTO = CustomerDTO(
            userRepresentation.email,
            userRepresentation.firstName,
            userRepresentation.lastName
        )

        customerService.createCustomer(customerDTO)

        return ResponseEntity("User signed up successfully.", HttpStatus.CREATED)
        */

        val userRepresentation = UserRepresentation()
        userRepresentation.firstName = signupRequest.name
        userRepresentation.lastName = signupRequest.surname
        userRepresentation.email = signupRequest.email
        userRepresentation.isEnabled = true

        val passwordCredentials = ArrayList<CredentialRepresentation>()
        val passwordCredential = CredentialRepresentation()
        passwordCredential.type = CredentialRepresentation.PASSWORD
        passwordCredential.value = signupRequest.password
        passwordCredential.isTemporary = false
        passwordCredentials.add(passwordCredential)
        userRepresentation.credentials = passwordCredentials

        var keycloak: Keycloak = Keycloak.getInstance(
            keycloakUrl,
            realmName,
            adminUsername,
            adminPassword,
            clientId
        )

        val realmResource: RealmResource = keycloak.realm(realmName)

        try {
            val userResource = realmResource.users().create(userRepresentation)
            return ResponseEntity.ok("User created Successfully")
        } catch (e: RuntimeException) {
            println(e.message)
            return ResponseEntity("Problem during registration!", HttpStatus.BAD_REQUEST)
        }
    }
}
