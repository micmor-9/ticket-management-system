package it.polito.wa2.g35.server.messages

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import jakarta.transaction.Transactional
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class MessageController(private val messageService: MessageService) {
    @Autowired
    lateinit var simpMessagingTemplate: SimpMessagingTemplate
    private val log: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("/messages/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "/messages/{ticketId}",
        contextualName = "get-messages-by-id-request"
    )
    fun getMessagesByTicket(@PathVariable ticketId: Long): List<MessageDTO>? {
        log.info("Get messages by Ticket request successful")
        return messageService.getMessagesByTicket(ticketId)
    }

    @PostMapping("/messages/send")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "/messages/send",
        contextualName = "send-message-request"
    )
    @Transactional
    fun postMessage(
        @RequestBody message: MessageInputDTO,
        br: BindingResult
    ): MessageDTO? {
        if (br.hasErrors()) {
            log.error("Create message request failed by bad request format")
            throw BadRequestException("Bad request format!")
        } else {
            log.info("Create message request successful")
            val savedMessage = messageService.postMessage(message)
            if (savedMessage != null) {
                simpMessagingTemplate.convertAndSend("/topic/chat-${message.ticket}", savedMessage)
            }
            return savedMessage
        }
    }

    @MessageMapping("/subscribe")
    fun subscribe(@Payload ticketId: String) {
        log.info("Client subscribed to ticket: $ticketId")
    }
}