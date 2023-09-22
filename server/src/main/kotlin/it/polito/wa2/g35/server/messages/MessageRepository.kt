package it.polito.wa2.g35.server.messages

import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

@Repository
interface MessageRepository: JpaRepository<Message, Long> {

    fun getMessagesByTicketIdOrderByMessageTimestamp(ticketId: Long): List<Message>

}