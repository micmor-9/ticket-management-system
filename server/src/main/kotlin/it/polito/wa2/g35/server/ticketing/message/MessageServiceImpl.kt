package it.polito.wa2.g35.server.ticketing.message

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.stereotype.Service
import java.util.Date

@Service
class MessageServiceImpl (private val messageRepository: MessageRepository) : MessageService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @Autowired
    lateinit var ticketService: TicketService
    @Observed(
        name = "/messages/{ticketId}",
        contextualName = "get-messages-by-id-request-service"
    )
    override fun getMessagesByTicket(ticketid : Long): List<MessageDTO> {
        val ticket = ticketService.getTicketById(ticketid)
        if(ticket == null) {
            log.error("No Ticket found with this Id: $ticketid")
            throw TicketNotFoundException("Ticket not found with this ID!")
        }
        else {
            val authentication = SecurityContextHolder.getContext().authentication
            when(authentication.authorities.map { it.authority }[0]){
                SecurityConfig.MANAGER_ROLE -> {
                    log.info("Get messages by Ticket from repository request successful")
                    return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                }
                SecurityConfig.CLIENT_ROLE -> {
                    if(ticket.customer.email != authentication.name) {
                        log.error("Get messages by Ticket failed by unauthorized access")
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    }
                    else {
                        log.info("Get messages by Ticket request successful")
                        return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                    }
                }
                SecurityConfig.EXPERT_ROLE -> {
                    if(ticket.expert?.email != authentication.name) {
                        log.error("Get messages by Ticket failed by unauthorized access")
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    }
                    else {
                        log.info("Get messages by Ticket from repository request successful")
                        return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                    }
                }
                else -> {
                    log.info("Get messages by Ticket from repository request successful")
                    return emptyList<MessageDTO>()
                }
            }
        }
    }
    @Observed(
        name = "/messages/",
        contextualName = "get-message-by-id-request"
    )
    override fun getMessageById(messageId: Long): MessageDTO? {
        val message = messageRepository.findByIdOrNull(messageId)?.toDTO()
        if (message != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            when(authentication.authorities.map { it.authority }[0]){
                SecurityConfig.MANAGER_ROLE -> {
                    log.info("Get messages by Id from repository request successful")
                    return message
                }
                SecurityConfig.CLIENT_ROLE -> {
                    if(message.ticket?.customer?.email != authentication.name) {
                        log.error("Get messages by Id failed by unauthorized access")
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    }
                    else {
                        log.info("Get messages by Id from repository request successful")
                        return message
                    }
                }
                SecurityConfig.EXPERT_ROLE -> {
                    if(message.ticket?.expert?.email != authentication.name) {
                        log.error("Get messages by Id failed by unauthorized access")
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    }
                    else {
                        log.info("Get messages by Id from repository request successful")
                        return message
                    }
                }
                else -> {
                    log.info("Get messages by Id from repository request failed")
                    return null
                }
            }
        } else {
            log.error("No Message found with this Id: $messageId")
            throw MessageNotFoundException("No message found with this id!")
        }
    }

    override fun postMessage(message: MessageInputDTO): MessageDTO? {
        val ticket = ticketService.getTicketById(message.ticket)?.toTicket()
        if(ticket == null){
            log.error("No Ticket found with this Id: ${message.ticket}")
            throw TicketNotFoundException("Ticket not found with this ID!")
        }
        val authentication = SecurityContextHolder.getContext().authentication
        when(authentication.authorities.map { it.authority }[0]){
            SecurityConfig.MANAGER_ROLE -> {
                log.info("Create message request successful (repository)")
                return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender)).toDTO()
            }
            SecurityConfig.CLIENT_ROLE -> {
                if(ticket.customer.email != authentication.name) {
                    log.error("Get messages by Id failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                }
                else {
                    log.info("Create message request successful (repository)")
                    return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender))
                        .toDTO()
                }
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(ticket.expert?.email != authentication.name) {
                    log.error("Create message failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                }
                else {
                    log.info("Create message request successful (repository)")
                    return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender))
                        .toDTO()
                }
            }
            else -> {
                log.info("Create message request failed (repository)")
                return null
            }
        }
    }

}