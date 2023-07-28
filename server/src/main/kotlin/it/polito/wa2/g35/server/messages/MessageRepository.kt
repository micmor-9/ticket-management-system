package it.polito.wa2.g35.server.messages

import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository

@Repository
interface MessageRepository: JpaRepository<Message, Long> {

    fun getMessagesByTicketId(ticketId: Long): List<Message>

}