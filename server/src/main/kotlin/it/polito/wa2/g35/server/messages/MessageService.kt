package it.polito.wa2.g35.server.messages

interface MessageService {
    fun getMessageById(messageId: Long): MessageDTO?

    fun getMessagesByTicket(ticketId : Long): List<MessageDTO>

    fun postMessage(message: MessageInputDTO): MessageDTO?
}