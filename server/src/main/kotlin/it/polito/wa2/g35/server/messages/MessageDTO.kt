package it.polito.wa2.g35.server.messages

import it.polito.wa2.g35.server.ticketing.ticket.Ticket
import java.util.Date

data class MessageDTO(
    val id: Long?,
    val messageTimestamp: Date?,
    val messageText: String,
    val ticket: Ticket?,
    val sender: String?
)
{
    constructor() : this(null,null,"", null,"")
}

fun Message.toDTO() : MessageDTO {
    return MessageDTO(this.id, this.messageTimestamp, this.messageText, this.ticket, this.sender)
}

fun MessageDTO.toMessage() : Message {
    return Message(this.id, this.messageTimestamp, this.messageText, this.ticket, this.sender)
}


