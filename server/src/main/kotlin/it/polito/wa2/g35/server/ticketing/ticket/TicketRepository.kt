package it.polito.wa2.g35.server.ticketing.ticket

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TicketRepository: JpaRepository<Ticket, Long> {

     fun getTicketsByStatusOrderByCreationTimestampAsc(status: TicketStatusValues) : List<Ticket>?

     fun getTicketsByExpertIdOrderByCreationTimestampAsc(idExpert: String) : List<Ticket>?

     fun getTicketsByPriorityOrderByCreationTimestampAsc(priority: TicketPriority) : List<Ticket>?

     fun getTicketsByCustomerEmailOrderByCreationTimestampAsc(idCustomer: String) : List<Ticket>?

     fun getTicketsByCustomerIdAndOrderId(customerId: Int, orderId: Long) : List<Ticket>?
}