package it.polito.wa2.g35.server.ticketing.attachment

data class AttachmentInputDTO(
    val id: Long?,
    val messageId: Long,
    val fileContent : String
)