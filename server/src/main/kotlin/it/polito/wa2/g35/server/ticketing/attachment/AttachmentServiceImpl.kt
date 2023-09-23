package it.polito.wa2.g35.server.ticketing.attachment

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.messages.MessageNotFoundException
import it.polito.wa2.g35.server.messages.MessageService
import it.polito.wa2.g35.server.messages.toMessage
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class AttachmentServiceImpl(private val attachmentRepository: AttachmentRepository) : AttachmentService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    /*@Autowired
    lateinit var messageService: MessageService*/
    /*@Observed(
        name = "/attachments/message/{messageId}",
        contextualName = "get-attachments-by-messageId-request-service"
    )
    override fun getAttachmentsByMessageById(messageId: Long?): List<AttachmentDTO> {
        val authentication = SecurityContextHolder.getContext().authentication
        /*val message = messageService.getMessageById(messageId!!)?.toMessage()
        if(message == null){
            log.error("No Message found with this Id: $messageId!!")
            throw MessageNotFoundException("There isn't any message with this id!")
        }*/
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Get attachments by MessageId from repository request successful")
                return attachmentRepository.getAttachmentsByMessageId(messageId!!).map { it.toDTO() }
            }
            SecurityConfig.EXPERT_ROLE -> {
                /*if(message.ticket?.expert?.email != authentication.name) {
                    log.error("Get attachments by MessageId failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                }
                else {*/
                    log.info("Get attachments by MessageId from repository request successful")
                    return attachmentRepository.getAttachmentsByMessageId(messageId!!).map { it.toDTO() }
                //}
            }
            SecurityConfig.CLIENT_ROLE -> {
                /*if (message.ticket?.customer?.email != authentication.name) {
                    log.error("Get attachments by MessageId failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                }
                else {*/
                    log.info("Get attachments by MessageId from repository request successful")
                    return attachmentRepository.getAttachmentsByMessageId(messageId!!).map { it.toDTO() }
                //}
            }
            else -> {
                log.info("Get attachments by MessageId from repository request successful")
                return emptyList()
            }
        }
    }*/
    @Observed(
        name = "/attachments/{attachmentId}",
        contextualName = "get-attachment-request-service"
    )
    override fun getAttachmentById(attachmentId: Long?): AttachmentDTO? {
        val attachment = if (attachmentId != null) attachmentRepository.findByIdOrNull(attachmentId)?.toDTO() else null
        val authentication = SecurityContextHolder.getContext().authentication
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Get attachment from repository request successful")
                return attachment
            }
            SecurityConfig.EXPERT_ROLE -> {
                //if(attachment?.message?.ticket?.expert?.email == authentication.name) {
                    log.info("Get attachment from repository request successful")
                    return attachment
                /*} else {
                    log.error("Get attachment failed by unauthorized access")
                    throw UnauthorizedTicketException("You don't have access to this ticket's messages")
                }*/
            }
            SecurityConfig.CLIENT_ROLE -> {
                //if(attachment?.message?.ticket?.customer?.email == authentication.name) {
                    log.info("Get attachment from repository request successful")
                    return attachment
                /*} else {
                    log.error("Get attachment request failed by unauthorized access")
                    throw UnauthorizedTicketException("You don't have access to this ticket's messages")
                }*/
            }
            else -> {
                    log.error("Get attachment request failed")
                    return null
            }
        }
    }
    @Observed(
        name = "/attachments",
        contextualName = "post-attachment-request-service"
    )
    override fun postAttachment(attachment: AttachmentInputDTO): AttachmentDTO? {
        val authentication = SecurityContextHolder.getContext().authentication

        return when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Create attachment request successful (repository)")
                return attachmentRepository.save(Attachment(null, /*message,*/ attachment.fileName, attachment.fileType, attachment.fileSize, attachment.fileContent)).toDTO()
            }
            SecurityConfig.EXPERT_ROLE -> {
                    log.info("Create attachment request successful (repository)")
                    return attachmentRepository.save(Attachment(null, /*message,*/ attachment.fileName, attachment.fileType, attachment.fileSize, attachment.fileContent)).toDTO()
            }
            SecurityConfig.CLIENT_ROLE -> {
                    log.info("Create attachment request successful (repository)")
                    return attachmentRepository.save(Attachment(null, /*message,*/ attachment.fileName, attachment.fileType, attachment.fileSize, attachment.fileContent)).toDTO()
            }
            else -> {
                log.error("Create attachment request failed")
                null
            }
        }
    }
}