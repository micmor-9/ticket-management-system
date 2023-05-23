package it.polito.wa2.g35.server.ticketing.ticketStatus

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TicketStatusRepository : JpaRepository<TicketStatus, Long> {
    fun getTicketStatusesByTicketId(ticketId: Long) : List<TicketStatus>
}