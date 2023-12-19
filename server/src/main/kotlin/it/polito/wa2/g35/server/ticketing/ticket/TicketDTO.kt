package it.polito.wa2.g35.server.ticketing.ticket

import it.polito.wa2.g35.server.products.Product
import it.polito.wa2.g35.server.profiles.customer.Customer
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.ticketing.order.Order
import java.util.*


data class TicketDTO (
    val id: Long?,
    val creationTimestamp: Date,
    val issueDescription: String,
    val priority: TicketPriority?,
    val status: TicketStatusValues,
    val expert: Expert?,
    val order: Order,
    var customer: Customer,
    val category: String,
    val rating: Int?
)

fun Ticket.toDTO(): TicketDTO {
    return TicketDTO(this.id, this.creationTimestamp, this.issueDescription, this.priority, this.status, this.expert, this.order, this.customer, this.category, this.rating)
}

fun TicketDTO.toTicket(): Ticket {
    return Ticket(this.id, this.creationTimestamp, this.issueDescription, this.priority, this.status, this.expert, this.order, this.customer, this.category, this.rating)
}

