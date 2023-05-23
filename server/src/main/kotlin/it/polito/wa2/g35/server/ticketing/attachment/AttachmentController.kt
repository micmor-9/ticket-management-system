package it.polito.wa2.g35.server.ticketing.attachment

import it.polito.wa2.g35.server.exceptions.BadRequestException
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class AttachmentController(private val attachmentService: AttachmentService) {


    @GetMapping("/attachments/message/{messageId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    fun getAttachmentsByMessageId(@PathVariable messageId: Long?) : List<AttachmentDTO>? {
        return attachmentService.getAttachmentsByMessageById(messageId)
    }


    @GetMapping("/attachments/{attachmentId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    fun getAttachment(@PathVariable attachmentId: Long?) : AttachmentDTO? {
        return attachmentService.getAttachmentById(attachmentId)
    }


    @PostMapping("/attachments")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('Manager', 'Expert', 'Client')")
    fun postAttachment(
        @RequestBody @Valid p: AttachmentInputDTO,
        br: BindingResult
    ){
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            attachmentService.postAttachment(p)
    }
}