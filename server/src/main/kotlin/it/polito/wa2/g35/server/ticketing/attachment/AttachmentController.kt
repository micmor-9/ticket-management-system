package it.polito.wa2.g35.server.ticketing.attachment

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class AttachmentController(private val attachmentService: AttachmentService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)


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
    ): AttachmentDTO? {
        log.info("Create attachment request successful")
        return attachmentService.postAttachment(attachment)
    }
}