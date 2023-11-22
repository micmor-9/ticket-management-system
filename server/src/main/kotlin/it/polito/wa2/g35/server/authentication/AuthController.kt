package it.polito.wa2.g35.server.authentication

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.*
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class AuthController {
    @Autowired
    lateinit var customerService: CustomerServiceImpl

    @Autowired
    lateinit var authService: AuthServiceImpl

    private val log: Logger = LoggerFactory.getLogger(AuthController::class.java)

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Observed(
        name = "login",
        contextualName = "login-request"
    )
    fun login(@RequestBody loginRequest: AuthRequest): ResponseEntity<AuthResponse> {
        val response = authService.login(loginRequest)
        if (response != null) {
            log.info("Login request successful of the user ${loginRequest.username}")
            return ResponseEntity.ok(response)
        } else {
            log.error("Wrong login request of the user ${loginRequest.username}")
            throw InvalidUserCredentialsException("Invalid username or password!")
        }
    }


    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    @Observed(
        name = "signup",
        contextualName = "signup-request"
    )
    fun signup(@RequestBody signupRequest: SignupCustomerRequest): ResponseEntity<String> {
        if (authService.signupCustomer(signupRequest) != null) {
            log.info("Signup request successful of the user ${signupRequest.email}")
            return ResponseEntity.ok("User created!")
        } else {
            log.error("Wrong signup request of the user ${signupRequest.email}: user already exists")
            return ResponseEntity("User already exists", HttpStatus.CONFLICT)
        }
    }

    @PostMapping("/createExpert")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "createExpert",
        contextualName = "create-expert-request"
    )
    fun createExpert(@RequestBody signupRequest: SignupExpertRequest) : ResponseEntity<String> {
        if (authService.signupExpert(signupRequest) != null) {
            log.info("Expert created: ${signupRequest.email}")
            return ResponseEntity.ok("Expert created!")
        } else {
            log.error("Wrong creation request of the expert ${signupRequest.email}: expert already exists")
            return ResponseEntity("Expert already exists", HttpStatus.CONFLICT)
        }
    }
    

}
