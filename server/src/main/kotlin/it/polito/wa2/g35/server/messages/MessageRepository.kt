package it.polito.wa2.g35.server.messages

import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

@Repository
interface MessageRepository: JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE m.ticket.id = :ticketId ORDER BY m.messageTimestamp ASC")
    fun getMessagesByTicketId(ticketId: Long): List<Message>

}