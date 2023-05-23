package it.polito.wa2.g35.server.ticketing.message

import it.polito.wa2.g35.server.exceptions.BadRequestException
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
class MessageController (private val messageService: MessageService) {
    @GetMapping("/messages/{ticketId}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun getMessagesByTicket(@PathVariable ticketId: Long): List<MessageDTO>? {
        return messageService.getMessagesByTicket(ticketId)
    }

    @PostMapping("/messages")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Expert', 'Manager', 'Client')")
    fun postMessage(@RequestBody message: MessageInputDTO,
                    br: BindingResult) : MessageDTO? {
        if(br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            return messageService.postMessage(message)
    }
}