package it.polito.wa2.g35.server.ticketing.message

import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketNotFoundException
import it.polito.wa2.g35.server.ticketing.ticket.TicketService
import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import it.polito.wa2.g35.server.ticketing.ticket.toTicket
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser
import org.springframework.stereotype.Service
import java.util.Date

@Service
class MessageServiceImpl (private val messageRepository: MessageRepository) : MessageService {
    @Autowired
    lateinit var ticketService: TicketService

    override fun getMessagesByTicket(ticketid : Long): List<MessageDTO> {
        val ticket = ticketService.getTicketById(ticketid)
        if(ticket == null)
            throw TicketNotFoundException("Ticket not found with this ID!")
        else {
            val authentication = SecurityContextHolder.getContext().authentication
            when(authentication.authorities.map { it.authority }[0]){
                SecurityConfig.MANAGER_ROLE -> {
                    return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                }
                SecurityConfig.CLIENT_ROLE -> {
                    if(ticket.customer.email != authentication.name)
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    else
                        return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                }
                SecurityConfig.EXPERT_ROLE -> {
                    if(ticket.expert?.email != authentication.name)
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    else
                        return messageRepository.getMessagesByTicketId(ticketid).map { it.toDTO() }
                }
                else -> {
                    return emptyList<MessageDTO>()
                }
            }
        }
    }

    override fun getMessageById(messageId: Long): MessageDTO? {
        val message = messageRepository.findByIdOrNull(messageId)?.toDTO()
        if (message != null) {
            val authentication = SecurityContextHolder.getContext().authentication
            when(authentication.authorities.map { it.authority }[0]){
                SecurityConfig.MANAGER_ROLE -> {
                    return message
                }
                SecurityConfig.CLIENT_ROLE -> {
                    if(message.ticket?.customer?.email != authentication.name)
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    else
                        return message
                }
                SecurityConfig.EXPERT_ROLE -> {
                    if(message.ticket?.expert?.email != authentication.name)
                        throw UnauthorizedTicketException("You can't access this ticket's messages")
                    else
                        return message
                }
                else -> {
                    return null
                }
            }
        } else {
            throw MessageNotFoundException("No message found with this id!")
        }
    }

    override fun postMessage(message: MessageInputDTO): MessageDTO? {
        val ticket = ticketService.getTicketById(message.ticket)?.toTicket()
            ?: throw TicketNotFoundException("Ticket not found with this ID!")
        val authentication = SecurityContextHolder.getContext().authentication
        when(authentication.authorities.map { it.authority }[0]){
            SecurityConfig.MANAGER_ROLE -> {
                return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender)).toDTO()
            }
            SecurityConfig.CLIENT_ROLE -> {
                if(ticket.customer.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else {
                    return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender))
                        .toDTO()
                }
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(ticket.expert?.email != authentication.name)
                    throw UnauthorizedTicketException("You can't access this ticket's messages")
                else {
                    return messageRepository.save(Message(null, Date(), message.messageText, ticket, message.sender))
                        .toDTO()
                }
            }
            else -> {
                return null
            }
        }
    }

}