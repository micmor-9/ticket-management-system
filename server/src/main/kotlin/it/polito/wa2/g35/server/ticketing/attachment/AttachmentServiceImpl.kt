package it.polito.wa2.g35.server.ticketing.attachment

import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.message.MessageNotFoundException
import it.polito.wa2.g35.server.ticketing.message.MessageService
import it.polito.wa2.g35.server.ticketing.message.toMessage
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AttachmentServiceImpl(private val attachmentRepository: AttachmentRepository) : AttachmentService {

    @Autowired
    lateinit var messageService: MessageService

    override fun getAttachmentsByMessageById(messageId: Long?): List<AttachmentDTO> {
        val authentication = SecurityContextHolder.getContext().authentication
        val message = messageService.getMessageById(messageId!!)?.toMessage() ?: throw MessageNotFoundException("There isn't any message with this id!")
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                return attachmentRepository.getAttachmentsByMessageId(messageId).map { it.toDTO() }
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(message.ticket?.expert?.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else
                   return attachmentRepository.getAttachmentsByMessageId(messageId).map { it.toDTO() }
            }
            SecurityConfig.CLIENT_ROLE -> {
                if(message.ticket?.customer?.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else
                    return attachmentRepository.getAttachmentsByMessageId(messageId).map { it.toDTO() }
            }
            else -> {
                return emptyList()
            }
        }
    }

    override fun getAttachmentById(attachmentId: Long?): AttachmentDTO? {
        val attachment = attachmentRepository.findByIdOrNull(attachmentId)?.toDTO()
        val authentication = SecurityContextHolder.getContext().authentication
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                return attachment
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(attachment?.message?.ticket?.expert?.email == authentication.name) {
                    return attachment
                } else {
                    throw UnauthorizedTicketException("You don't have access to this ticket's messages")
                }
            }
            SecurityConfig.CLIENT_ROLE -> {
                if(attachment?.message?.ticket?.customer?.email == authentication.name) {
                    return attachment
                } else {
                    throw UnauthorizedTicketException("You don't have access to this ticket's messages")
                }
            }
            else -> return null
        }
    }

    override fun postAttachment(attachment: AttachmentInputDTO): AttachmentDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val message = messageService.getMessageById(attachment.messageId)?.toMessage()
            ?: throw MessageNotFoundException("Message not found with this ID!")

        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                return attachmentRepository.save(Attachment(null, message, attachment.fileContent)).toDTO()
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(message.ticket?.expert?.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else
                    return attachmentRepository.save(Attachment(null, message, attachment.fileContent)).toDTO()
            }
            SecurityConfig.CLIENT_ROLE -> {
                if(message.ticket?.customer?.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else
                    return attachmentRepository.save(Attachment(null, message, attachment.fileContent)).toDTO()
            }
            else -> null
        }
    }
}