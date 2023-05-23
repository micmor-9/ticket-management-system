package it.polito.wa2.g35.server.profiles.customer

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table

/*Automatically mapped to database table */
@Entity
@Table(name = "customer")
class Customer(@Id var email: String, var name: String, var surname: String)