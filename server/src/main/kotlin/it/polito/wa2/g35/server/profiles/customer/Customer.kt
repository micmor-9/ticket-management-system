package it.polito.wa2.g35.server.profiles.customer

import jakarta.persistence.*

/*Automatically mapped to database table */
@Entity
@Table(name = "customer")
class Customer(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Int? = null,
    var email: String,
    var name: String,
    var surname: String,
    var contact: String,
    var address1: String,
    var address2: String?
)