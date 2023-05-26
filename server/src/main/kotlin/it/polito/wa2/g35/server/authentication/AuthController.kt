package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import org.springframework.http.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize


@RestController
class AuthController {

    /*@Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
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
    final lateinit var adminPassword: String*/

    @Autowired
    lateinit var customerService: CustomerServiceImpl

    @Autowired
    lateinit var authService: AuthServiceImpl


    @PostMapping("/login")
    fun login(@RequestBody loginRequest: AuthRequest): ResponseEntity<AuthResponse> {
        val response = authService.login(loginRequest)
        if (response != null)
            return ResponseEntity.ok(response)
        else
            throw InvalidUserCredentialsException("Invalid username or password!")
    }


    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    fun signup(@RequestBody signupRequest: SignupCustomerRequest): ResponseEntity<String> {
        if (authService.signupCustomer(signupRequest) != null) {
            return ResponseEntity.ok("User created!")
        } else {
            return ResponseEntity("User already exists", HttpStatus.CONFLICT)
        }
    }

    @PostMapping("/createExpert")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    fun createExpert(@RequestBody signupRequest: SignupExpertRequest) : ResponseEntity<String> {

        if (authService.signupExpert(signupRequest) != null) {
            return ResponseEntity.ok("Expert created!")
        } else {
            return ResponseEntity("Expert already exists", HttpStatus.CONFLICT)
        }
    }

}
