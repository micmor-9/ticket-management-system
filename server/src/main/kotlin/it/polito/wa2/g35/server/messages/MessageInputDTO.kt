package it.polito.wa2.g35.server.messages

import it.polito.wa2.g35.server.ticketing.attachment.AttachmentInputDTO
import java.util.*

data class MessageInputDTO (
    val id: Long?,
    val messageTimestamp: Date?,
    val messageText: String,
    val ticket: Long,
    val sender: String?,
    val attachment: AttachmentInputDTO?
)