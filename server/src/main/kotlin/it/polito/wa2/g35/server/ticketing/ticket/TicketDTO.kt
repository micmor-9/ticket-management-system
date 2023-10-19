package it.polito.wa2.g35.server.ticketing.ticket

import it.polito.wa2.g35.server.products.Product
import it.polito.wa2.g35.server.profiles.customer.Customer
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import java.util.*


data class TicketDTO (
    val id: Long?,
    val creationTimestamp: Date,
    val issueDescription: String,
    val priority: TicketPriority?,
    val status: TicketStatusValues,
    val expert: Expert?,
    val product: Product,
    var customer: Customer
)

fun Ticket.toDTO(): TicketDTO {
    return TicketDTO(this.id, this.creationTimestamp, this.issueDescription, this.priority, this.status, this.expert, this.product, this.customer)
}

fun TicketDTO.toTicket(): Ticket {
    return Ticket(this.id, this.creationTimestamp, this.issueDescription, this.priority, this.status, this.expert, this.product, this.customer)
}

