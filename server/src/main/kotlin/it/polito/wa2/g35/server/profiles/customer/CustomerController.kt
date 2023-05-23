package it.polito.wa2.g35.server.profiles.customer

import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult

import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class CustomerController(private val customerService: CustomerService) {
    @GetMapping("/profiles/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    fun getProfile(@PathVariable email: String): CustomerDTO? {
        return customerService.getCustomerByEmail(email)
    }

    @PostMapping("/profiles")
    @ResponseStatus(HttpStatus.CREATED)
    fun postProfile(
        @RequestBody @Valid p: CustomerDTO,
        br: BindingResult
    ) : CustomerDTO? {
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            return customerService.createCustomer(p)
    }

    @PutMapping("/profiles/{email}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Manager', 'Client')")
    fun updateProfile(
        @PathVariable("email") email: String,
        @RequestBody @Valid p: CustomerDTO,
        br: BindingResult
    ) : CustomerDTO? {
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            if (email == p.email) {
                return customerService.updateCustomer(p)
            } else
                throw ProfileNotFoundException("Profile with given email doesn't exists!")
    }
}