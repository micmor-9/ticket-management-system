package it.polito.wa2.g35.server.ticketing.message

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
class MessageController (private val messageService: MessageService) {
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
}