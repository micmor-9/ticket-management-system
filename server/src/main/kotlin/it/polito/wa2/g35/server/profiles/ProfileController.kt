package it.polito.wa2.g35.server.profiles

import io.micrometer.observation.annotation.Observed
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class ProfileController(private val profileService: ProfileService) {
    private val log: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/users/{email}")
    @PreAuthorize("hasAnyRole('Client', 'Expert', 'Manager')")
    @Observed(
        name = "/users/{email}",
        contextualName = "get-username-by-email-request"
    )
    fun getUsernameByEmail(@PathVariable email: String): String? {
        log.info("Get username by email request successful")
        return profileService.getUsernameByEmail(email)
    }
}