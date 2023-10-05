package it.polito.wa2.g35.server.profiles.employee.manager

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class ManagerController(private val managerService: ManagerService){
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @GetMapping("/managers/{managerEmail}")
    @PreAuthorize("hasAnyRole('Manager')")
    @Observed(
        name = "/managers/{managerEmail}",
        contextualName = "get-manager-id-request"
    )
    fun getManager(@PathVariable managerEmail: String?) : ManagerDTO? {
        log.info("Get manager Id request successful")
        return managerService.getManager(managerEmail)
    }

    @GetMapping("/users/{email}")
    @PreAuthorize("hasAnyRole('Client', 'Expert', 'Manager')")
    @Observed(
        name = "/users/{email}",
        contextualName = "get-username-by-email-request"
    )
    fun getUsernameByEmail(@PathVariable email: String) : String? {
        log.info("Get username by email request successful")
        return managerService.getUsernameByEmail(email)
    }


}