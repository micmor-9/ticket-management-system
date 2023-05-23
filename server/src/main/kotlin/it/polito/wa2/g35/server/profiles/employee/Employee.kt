package it.polito.wa2.g35.server.profiles.employee

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
open class Employee (
    @Column(updatable = false, nullable = false)
    @Id
    open var id: String?,
    open val name: String,
    open val surname: String,
    open val email: String
)