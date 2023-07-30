package it.polito.wa2.g35.server.messages

import org.springframework.security.core.annotation.AuthenticationPrincipal

interface MessageService {
    fun getMessageById(messageId: Long): MessageDTO?

    fun getMessagesByTicket(ticketid : Long): List<MessageDTO>

    fun postMessage(message: MessageInputDTO): MessageDTO?
}