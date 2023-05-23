package it.polito.wa2.g35.server.products

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "product")
class Product (
    @Id
    var id: String = "",
    var name: String = ""
)