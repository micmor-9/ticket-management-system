package it.polito.wa2.g35.server.ticketing.order

import it.polito.wa2.g35.server.products.Product
import it.polito.wa2.g35.server.profiles.customer.Customer
import jakarta.persistence.*
import java.util.Date

@Entity
@Table(name = "orders")
class Order (
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false)
    var id: Long? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val date: Date,

    @Temporal(TemporalType.TIMESTAMP)
    val warrantyDuration: Date,

    @ManyToOne(fetch = FetchType.LAZY)
    val customer: Customer,

    @ManyToOne(fetch = FetchType.LAZY)
    val product: Product,

    val quantity: Int?
)