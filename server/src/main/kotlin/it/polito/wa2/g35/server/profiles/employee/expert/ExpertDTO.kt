package it.polito.wa2.g35.server.profiles.employee.expert


data class ExpertDTO (
    val id: String?,
    val name: String,
    val surname: String,
    val email: String,
    val specialization: String
    )
{
    constructor() : this("", "","","","")
}


fun Expert.toDTO() : ExpertDTO {
    return ExpertDTO(this.id, this.name, this.surname, this.email, this.specialization)
}

fun ExpertDTO.toExpert() : Expert {
    return Expert(this.id, this.name, this.surname, this.email, this.specialization)
}

