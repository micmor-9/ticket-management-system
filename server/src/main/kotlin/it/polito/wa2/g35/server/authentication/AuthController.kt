package it.polito.wa2.g35.server.authentication

import org.aspectj.weaver.tools.cache.SimpleCacheFactory.enabled
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.*
import org.springframework.http.ResponseEntity
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.RestTemplate
import sun.jvm.hotspot.oops.CellTypeState.value
//import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.resource.RealmResource
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation

@RestController
@RequestMapping("/login")
class AuthController {

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var keycloakUrl: String

    @Value("\${spring.security.oauth2.resourceserver.jwt.resource-id}")
    lateinit var clientId: String

    @PostMapping("/")
    fun login(@RequestBody loginRequest: AuthRequest): ResponseEntity<AuthResponse> {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val requestBody: MultiValueMap<String, String> = LinkedMultiValueMap()
        requestBody.add("grant_type", "password")
        requestBody.add("client_id", clientId)
        requestBody.add("username", loginRequest.username)
        requestBody.add("password", loginRequest.password)

        val requestEntity = HttpEntity(requestBody, headers)

        val keycloakUrlTokenRequest = "$keycloakUrl/protocol/openid-connect/token"

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

    private val keycloak: Keycloak = Keycloak.getInstance(
        keycloakUrl,
        "SpringBootKeycloak",
        "admin",
        "admin",
        clientId
    )

    @PostMapping
    fun signup(@RequestBody userDetails: UserDetails): ResponseEntity<String> {
        val realmResource: RealmResource = keycloak.realm("realm")

        val userRepresentation = UserRepresentation().apply {
            username = userDetails.username
            email = userDetails.email
            enabled = true
        }

        val credentialRepresentation = CredentialRepresentation().apply {
            type = CredentialRepresentation.PASSWORD
            value = userDetails.password
            isTemporary = false
        }

        userRepresentation.credentials = listOf(credentialRepresentation)

        realmResource.users().create(userRepresentation)

        return ResponseEntity("User signed up successfully.", HttpStatus.OK)
    }
}
