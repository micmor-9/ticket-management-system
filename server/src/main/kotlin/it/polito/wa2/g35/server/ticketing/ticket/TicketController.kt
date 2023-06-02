package it.polito.wa2.g35.server.ticketing.ticket

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.authentication.AuthController
import it.polito.wa2.g35.server.exceptions.BadRequestException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class TicketController(private val ticketService: TicketService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @GetMapping("/tickets")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "tickets",
        contextualName = "get-tickets-request"
    )
    fun getTickets(): List<TicketDTO>? {
        log.info("Get tickets request successful")
        return ticketService.getAll()
    }

    @GetMapping("/tickets/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "tickets/{ticketId}",
        contextualName = "get-ticket-by-id-request"
    )
    fun getTicketById(@PathVariable ticketId:Long): TicketDTO? {
        log.info("Get ticket by id request successful")
        return ticketService.getTicketById(ticketId)
    }

    @GetMapping("/tickets/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "tickets/status/{status}",
        contextualName = "get-tickets-by-status-request"
    )
    fun getTicketsByStatus(@PathVariable status: String): List<TicketDTO>?{
        log.info("Get tickets by status request successful")
        return ticketService.getTicketsByStatus(status)
    }

    @GetMapping("/tickets/expert/{expertId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager')")
    @Observed(
        name = "tickets/expert/{expertId}",
        contextualName = "get-tickets-by-expert-request"
    )
    fun getTicketsByExpert(@PathVariable expertId: String): List<TicketDTO>?{
        log.info("Get tickets by expert request successful")
        return ticketService.getTicketsByExpert(expertId)
    }

    @GetMapping("/tickets/priority/{priority}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "tickets/priority/{priority}",
        contextualName = "get-tickets-by-priority-request"
    )
    fun getTicketsByPriority(@PathVariable priority: String): List<TicketDTO>?{
        log.info("Get tickets by priority request successful")
        return ticketService.getTicketsByPriority(priority)
    }

    @GetMapping("/tickets/customer/{customerId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "tickets/customer/{customerId}",
        contextualName = "get-tickets-by-customer-request"
    )
    fun getTicketsByCustomer(@PathVariable customerId: String): List<TicketDTO>?{
        log.info("Get tickets by customer request successful")
        return ticketService.getTicketsByCustomer(customerId)
    }

    @PostMapping("/tickets/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager', 'Client')")
    @Observed(
        name = "tickets/",
        contextualName = "post-ticket-request"
    )
    fun postTicket(
        @RequestBody ts: TicketInputDTO
    ) : TicketDTO? {
        return ticketService.createTicket(ts)
    }

    @PutMapping("/tickets/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    fun updateTicket(
        @PathVariable("ticketId") ticketId: Long,
        @RequestBody p: TicketInputDTO,
        br: BindingResult
    ) : TicketDTO? {
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            if (ticketId == p.id) {
                return ticketService.updateTicket(p)
            } else
                throw TicketConflictException("Ticket with given id doesn't exists!")
    }

    @PatchMapping("/tickets/{ticketId}/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager','Expert')")
    fun updateTicketStatus(
        @PathVariable("ticketId") ticketId: Long,
        @PathVariable("status") status: String
    ) {
        ticketService.updateTicketStatus(ticketId, status)
    }

    @PatchMapping("/tickets/{ticketId}/priority/{priority}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager')")
    fun updateTicketPriority(
        @PathVariable("ticketId") ticketId: Long,
        @PathVariable("priority") priority: String
    ) {
        ticketService.updateTicketPriority(ticketId, priority)
    }
}