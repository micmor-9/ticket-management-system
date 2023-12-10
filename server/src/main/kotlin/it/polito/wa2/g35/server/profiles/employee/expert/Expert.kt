package it.polito.wa2.g35.server.profiles.employee.expert

import it.polito.wa2.g35.server.profiles.employee.Employee
import jakarta.persistence.*


@Entity
@Table(name = "expert")
class Expert(
        @Id
        var id: String,
        var name: String,
        var surname: String,
        var email: String,
        var specialization: String,
)