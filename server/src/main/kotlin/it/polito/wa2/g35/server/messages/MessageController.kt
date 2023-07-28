package it.polito.wa2.g35.server.messages

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class MessageController (private val messageService: MessageService, private val messagingTemplate: SimpMessagingTemplate) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
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

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    @Observed(
        name = "/messages/",
        contextualName = "post-message-request"
    )
    fun postMessage(@RequestBody message: MessageInputDTO,
                    br: BindingResult) : MessageDTO? {
        if(br.hasErrors()) {
            log.error("Create message request failed by bad request format")
            throw BadRequestException("Bad request format!")
        }
        else {
            log.info("Create message request successful")
            return messageService.postMessage(message)
        }
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/{ticketId}") // Questo farà in modo che il messaggio venga trasmesso a tutti i client che si sono abbonati al topic specifico
    fun sendMessage(@Payload message: MessageInputDTO): MessageDTO? {
        log.info("Received new message: " + message.messageText)

        // Salva il messaggio nel database utilizzando il service
        val savedMessage = messageService.postMessage(message)

        // Invia il messaggio ai client tramite WebSocket
        if (savedMessage != null) {
            messagingTemplate.convertAndSend("/topic/${message.ticket}", savedMessage)
        }

        return savedMessage
    }

    @MessageMapping("/chat.subscribe")
    fun subscribe(@Payload ticketId: String) {
        // Il frontend dovrebbe inviare l'ID del ticket a cui desidera abbonarsi
        log.info("Client subscribed to ticket: $ticketId")
        // Puoi aggiungere la logica per gestire il fatto che il client si è abbonato a un ticket specifico
    }
}