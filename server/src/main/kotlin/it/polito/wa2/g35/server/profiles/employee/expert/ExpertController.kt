package it.polito.wa2.g35.server.profiles.employee.expert

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import jakarta.validation.Valid
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class ExpertController(private val expertService: ExpertService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @GetMapping("/experts/{expertId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    @Observed(
        name = "/experts/{expertId}",
        contextualName = "get-expert-by-id-request"
    )
    fun getExpertById(@PathVariable expertId: String?): ExpertDTO? {
        log.info("Get expert by Id request successful")
        return expertService.getExpertById(expertId)
    }

    @GetMapping("/experts/id/{expertEmail}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    @Observed(
        name = "/experts/id/{expertEmail}",
        contextualName = "get-expert-id-by-email-request"
    )
    fun getExpert(@PathVariable expertEmail: String?): ExpertDTO? {
        log.info("Get expert Id request successful")
        return expertService.getExpert(expertEmail)
    }

    @GetMapping("/experts")
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    @Observed(
        name = "/experts",
        contextualName = "get-all-expert-request"
    )
    fun getAllExperts(): List<ExpertDTO>? {
        log.info("Get expert Id request successful")
        return expertService.getAll()
    }

    @GetMapping("/experts/specialization/{specialization}")
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "/experts/specialization/{specialization}",
        contextualName = "get-expert-by-specialization-request"
    )
    fun getExpertBySpecialization(@PathVariable specialization: String?): List<ExpertDTO> {
        log.info("Get expert by Specialization request successful")
        return expertService.getExpertBySpecialization(specialization)
    }

    @GetMapping("/experts/specializations/")
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    @Observed(
        name = "/experts/specializations/",
        contextualName = "get-expert-specializations-request"
    )
    fun getExpertsSpecializations(): List<String> {
        log.info("Get experts Specializations request successful")
        return expertService.getExpertsSpecializations()
    }

    @PostMapping("/experts")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "/experts",
        contextualName = "post-expert-request"
    )
    fun createExpert(
        @RequestBody @Valid p: ExpertDTO,
        br: BindingResult
    ): ExpertDTO? {
        if (br.hasErrors()) {
            log.error("Create expert request failed by bad request format")
            throw BadRequestException("Bad request format!")
        } else {
            log.info("Create expert request successful")
            return expertService.createExpert(p)
        }
    }
}