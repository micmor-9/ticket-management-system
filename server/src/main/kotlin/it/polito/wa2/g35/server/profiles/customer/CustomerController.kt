package it.polito.wa2.g35.server.profiles.customer

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import jakarta.validation.Valid
import org.aspectj.weaver.tools.cache.SimpleCacheFactory.enabled
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.keycloak.admin.client.Keycloak
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.context.annotation.Profile
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class CustomerController(private val customerService: CustomerService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)


    @GetMapping("/customers/id/{customerEmail}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @Observed(
        name = "/customers/id/{customerEmail}",
        contextualName = "get-profile-request"
    )
    fun getProfileId(@PathVariable customerEmail: String): CustomerDTO? {
        log.info("Get Profile Id request successful")
        return customerService.getCustomer(customerEmail)
    }

    @GetMapping("/customers/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @Observed(
        name = "/customers/{email}",
        contextualName = "get-profile-request"
    )
    fun getProfile(@PathVariable email: String): CustomerDTO? {
        log.info("Get Profile request successful")
        return customerService.getCustomerByEmail(email)
    }


    @GetMapping("/customers")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    @Observed(
        name = "/customers",
        contextualName = "get-profiles-request"
    )
    fun getProfiles(): List<CustomerDTO>? {
        log.info("Get Profiles request successful")
        return customerService.getAllCustomers()
    }


    @PostMapping("/customers/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @Observed(
        name = "/customers/",
        contextualName = "post-profile-request"
    )
    fun postProfile(
        @RequestBody @Valid p: CustomerDTO,
        br: BindingResult
    ): CustomerDTO? {
        if (br.hasErrors()) {
            log.error("Create Profile request failed by bad request format")
            throw BadRequestException("Bad request format!")
        } else {
            log.info("Create Profile request successful")
            return customerService.createCustomer(p)
        }
    }

    @PutMapping("/customers/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager', 'Client')")
    @Observed(
        name = "/customers/{email}",
        contextualName = "put-profile-request"
    )
    fun updateProfile(
        @PathVariable("email") email: String,
        @RequestBody @Valid p: CustomerDTO,
        br: BindingResult
    ): CustomerDTO? {
        if (br.hasErrors()) {
            log.error("Update Profile failed by bad request format")
            throw BadRequestException("Bad request format!")
        } else
            if (email == p.email) {
                log.info("Update Profile request successful")
                return customerService.updateCustomer(p)
            } else {
                log.error("Profile with given email doesn't exists!")
                throw ProfileNotFoundException("Profile with given email doesn't exists!")
            }
    }
}