package it.polito.wa2.g35.server.ticketing.attachment

import it.polito.wa2.g35.server.messages.Message

data class AttachmentDTO(
    val id: Long?,
    //val message: Message,
    val fileName: String,
    val fileType: String,
    val fileSize: Double,
    val fileContent : ByteArray
) {
    constructor() : this(null, /*Message(null,null,"",null,"", null),*/"", "", 0.0, ByteArray(0))

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as AttachmentDTO

        if (id != other.id) return false
        //if (message != other.message) return false
        if (fileName != other.fileName) return false
        if (fileType != other.fileType) return false
        if (fileSize != other.fileSize) return false
        return fileContent.contentEquals(other.fileContent)
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        //result = 31 * result + message.hashCode()
        result = 31 * result + fileName.hashCode()
        result = 31 * result + fileType.hashCode()
        result = 31 * result + fileSize.hashCode()
        result = 31 * result + fileContent.contentHashCode()
        return result
    }
}

fun Attachment.toDTO() : AttachmentDTO {
    return AttachmentDTO(this.id, /*this.message,*/ this.fileName, this.fileType, this.fileSize, this.fileContent)
}

fun AttachmentDTO.toAttachment() : Attachment {
    return Attachment(this.id, /*this.message,*/ this.fileName, this.fileType, this.fileSize, this.fileContent)
}