package it.polito.wa2.g35.server.profiles.employee.expert

import it.polito.wa2.g35.server.exceptions.BadRequestException
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
class ExpertController(private val expertService: ExpertService){
    @GetMapping("/experts/{expertId}")
    @PreAuthorize("hasAnyRole('Manager', 'Expert')")
    fun getExpertById(@PathVariable expertId: String?) : ExpertDTO? {
        return expertService.getExpertById(expertId)
    }

    @GetMapping("/experts/specialization/{specialization}")
    @PreAuthorize("hasRole('Manager')")
    fun getExpertBySpecialization(@PathVariable specialization: String?) : List<ExpertDTO> {
        return expertService.getExpertBySpecialization(specialization)
    }

    @PostMapping("/experts")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    fun createExpert(
        @RequestBody @Valid p: ExpertDTO,
        br: BindingResult
    ) : ExpertDTO? {
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            return expertService.createExpert(p)
    }
}