package it.polito.wa2.g35.server.profiles.employee.expert

import it.polito.wa2.g35.server.profiles.employee.Employee
import jakarta.persistence.Entity
import jakarta.persistence.Id

@Entity
class Expert(
    id: String? = "",
    name: String = "",
    surname: String = "",
    email: String = "",
    var specialization: String = ""
) : Employee(id, name, surname, email)