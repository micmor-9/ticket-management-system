package it.polito.wa2.g35.server.ticketing.attachment

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AttachmentRepository: JpaRepository<Attachment, Long>{

    fun getAttachmentsByMessageId(messageId: Long) : List<Attachment>
}