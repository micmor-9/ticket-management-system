package it.polito.wa2.g35.server.profiles.customer

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size


data class CustomerDTO(
    val id: Int?,
    @field:Email(regexp = ".*"+"@"+".*"+"\\."+".*") @Size(min=4,max=40) @NotBlank
    val email: String,
    @field:Size(min=2,max=25) @NotBlank
    var name: String,
    @field:Size(min=2,max=25) @NotBlank
    var surname: String
)
{
    constructor() : this(0,"","", "")
}


fun Customer.toDTO() : CustomerDTO {
    return CustomerDTO(this.id, this.email, this.name, this.surname)
}

fun CustomerDTO.toCustomer() : Customer {
    return Customer(this.id, this.email, this.name, this.surname)
}

