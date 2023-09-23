package it.polito.wa2.g35.server.ticketing.attachment

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*
import java.util.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class AttachmentController(private val attachmentService: AttachmentService) {
    @Autowired
    lateinit var simpMessagingTemplate: SimpMessagingTemplate

    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    /*@GetMapping("/attachments/message/{messageId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    @Observed(
        name = "/attachments/message/{messageId}",
        contextualName = "get-attachments-by-messageId-request"
    )
    fun getAttachmentsByMessageId(@PathVariable messageId: Long?) : List<AttachmentDTO>? {
        log.info("Get attachments by MessageId request successful")
        return attachmentService.getAttachmentsByMessageById(messageId)
    }*/


    @GetMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    @Observed(
        name = "/attachments/{attachmentId}",
        contextualName = "get-attachment-request"
    )
    fun getAttachment(@PathVariable attachmentId: Long?) : AttachmentDTO? {
        log.info("Get attachments request successful")
        return attachmentService.getAttachmentById(attachmentId)
    }


    @PostMapping("/attachments/upload")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    @Observed(
        name = "/attachments",
        contextualName = "post-attachment-request"
    )
    fun postAttachment(
        @RequestBody attachment: AttachmentInputDTO
    ) : AttachmentDTO? {
        log.info("Create attachment request successful")
        val savedAttachment = attachmentService.postAttachment(attachment)
        /*if (savedAttachment != null) {
            simpMessagingTemplate.convertAndSend("/topic/${savedAttachment.message.ticket}", savedAttachment)
        }*/
        return savedAttachment
    }
}