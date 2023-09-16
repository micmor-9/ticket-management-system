package it.polito.wa2.g35.server.messages

import java.util.*

data class MessageInputDTO (
    val id: Long?,
    val messageTimestamp: Date?,
    val messageText: String,
    val ticket: Long,
    val sender: String?,
    val attachmentId: Long?
)