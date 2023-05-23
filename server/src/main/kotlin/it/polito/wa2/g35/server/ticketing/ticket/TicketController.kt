package it.polito.wa2.g35.server.ticketing.ticket

import it.polito.wa2.g35.server.exceptions.BadRequestException
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class TicketController(private val ticketService: TicketService) {
    @GetMapping("/tickets")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('Manager')")
    fun getTickets(): List<TicketDTO>? {
        return ticketService.getAll()
    }

    @GetMapping("/tickets/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun getTicketById(@PathVariable ticketId:Long): TicketDTO? {
        return ticketService.getTicketById(ticketId)
    }

    @GetMapping("/tickets/status/{status}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun getTicketsByStatus(@PathVariable status: String): List<TicketDTO>?{
        return ticketService.getTicketsByStatus(status)
    }

    @GetMapping("/tickets/expert/{expertId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager')")
    fun getTicketsByExpert(@PathVariable expertId: String): List<TicketDTO>?{
        return ticketService.getTicketsByExpert(expertId)
    }

    @GetMapping("/tickets/priority/{priority}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun getTicketsByPriority(@PathVariable priority: String): List<TicketDTO>?{
        return ticketService.getTicketsByPriority(priority)
    }

    @GetMapping("/tickets/customer/{customerId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun getTicketsByCustomer(@PathVariable customerId: String): List<TicketDTO>?{
        return ticketService.getTicketsByCustomer(customerId)
    }

    @PostMapping("/tickets/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager', 'Client')")
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