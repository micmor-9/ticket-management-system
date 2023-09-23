package it.polito.wa2.g35.server.ticketing.attachment

data class AttachmentInputDTO(
    val id: Long?,
    val fileName: String,
    val fileType: String,
    val fileSize: Double,
    val fileContent : ByteArray
)