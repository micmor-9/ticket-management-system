package it.polito.wa2.g35.server.authentication

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.customer.Customer
import it.polito.wa2.g35.server.profiles.customer.CustomerServiceImpl

import it.polito.wa2.g35.server.profiles.customer.toDTO
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertServiceImpl
import it.polito.wa2.g35.server.profiles.employee.expert.toDTO
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
    lateinit var expertService: ExpertService

    @Autowired
    lateinit var expertServiceImpl: ExpertServiceImpl

    @Autowired
    lateinit var authService: AuthServiceImpl

    private val log: Logger = LoggerFactory.getLogger(javaClass)

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
            customerService.createCustomer(
                Customer(
                    null,
                    signupRequest.email,
                    signupRequest.name,
                    signupRequest.surname,
                    signupRequest.contact,
                    signupRequest.address1,
                    signupRequest.address2
                ).toDTO()
            )
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
    fun createExpert(@RequestBody signupRequest: SignupExpertRequest): ResponseEntity<String> {
        if (authService.signupExpert(signupRequest) != null) {
            authService.signupExpert(signupRequest)

            log.info("Expert created: ${signupRequest.email}")
            return ResponseEntity.ok("Expert created!")
        } else {
            log.error("Wrong creation request of the expert ${signupRequest.email}: expert already exists")
            return ResponseEntity("Expert already exists", HttpStatus.CONFLICT)
        }
    }

    @PostMapping("/resetPassword")
    @ResponseStatus(HttpStatus.OK)
    @Observed(
            name = "resetPassword",
            contextualName = "reset-password-request"
    )
    fun resetPassw(@RequestParam("email") email: String): ResponseEntity<String> {
        return if (authService.resetPassw(email)) {
            log.info("Password reset request successful for email: $email")
            ResponseEntity.ok("Password reset successful! Check your email for the new password.")
        } else {
            log.error("Password reset request failed for email: $email")
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with the given email address.")
        }
    }

    @PostMapping("/changePassword")
    @ResponseStatus(HttpStatus.OK)
    @Observed(
            name = "changePassword",
            contextualName = "change-password-request"
    )
    fun changePassword(@RequestBody request: ChangePasswordRequest): ResponseEntity<String> {
        return if (authService.changePassword(request)) {
            log.info("Password change request successful for email: ${request.email}")
            ResponseEntity.ok("Password change successful!")
        } else {
            log.error("Password change request failed for email: ${request.email}")
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password change failed. Please check your credentials.")
        }
    }



}
