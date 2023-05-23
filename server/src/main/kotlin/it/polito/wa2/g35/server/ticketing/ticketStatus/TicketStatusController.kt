package it.polito.wa2.g35.server.ticketing.ticketStatus

import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@Validated
@RestController
class TicketStatusController(private val ticketStatusService: TicketStatusService){
    /*@PostMapping("/status/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager')")
    fun postTicketStatus(
        @RequestBody ts: TicketStatusDTO,
    ) {
        ticketStatusService.createTicketStatus(ts)
    }*/

    @GetMapping("/status/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('Manager')")
    fun getTicketStatusByTicketId(
        @PathVariable ticketId: Long
    ) : List<TicketStatusDTO> {
       return ticketStatusService.getTicketStatusesByTicketId(ticketId)
    }
}