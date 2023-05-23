package it.polito.wa2.g35.server.ticketing.ticket

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TicketRepository: JpaRepository<Ticket, Long> {

     fun getTicketsByStatus(status: TicketStatusValues) : List<Ticket>?

     fun getTicketsByExpertId(idExpert: String) : List<Ticket>?

     fun getTicketsByPriority(priority: TicketPriority) : List<Ticket>?

     fun getTicketsByCustomerEmail(idCustomer: String) : List<Ticket>?

}