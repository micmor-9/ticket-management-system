package it.polito.wa2.g35.server.ticketing.ticketStatus

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@Validated
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class TicketStatusController(private val ticketStatusService: TicketStatusService) {
    private val log: Logger = LoggerFactory.getLogger(javaClass)
    /*@PostMapping("/status/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager')")
    @Observed(
        name = "status/",
        contextualName = "post-ticket-status-request"
    )
    fun postTicketStatus(
        @RequestBody ts: TicketStatusDTO,
    ) {
        ticketStatusService.createTicketStatus(ts)
    }*/

    @GetMapping("/status/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager', 'Client', 'Expert')")
    @Observed(
        name = "status/{ticketId}",
        contextualName = "get-ticket-status-request"
    )
    fun getTicketStatusByTicketId(
        @PathVariable ticketId: Long
    ): List<TicketStatusDTO> {
        log.info("Get tickets status by Id successful")
        return ticketStatusService.getTicketStatusesByTicketId(ticketId)
    }
}