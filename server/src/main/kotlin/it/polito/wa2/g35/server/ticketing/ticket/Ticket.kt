package it.polito.wa2.g35.server.ticketing.ticket

import it.polito.wa2.g35.server.profiles.customer.Customer
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.ticketing.order.Order
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "ticket")
class Ticket(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false)
    var id: Long? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val creationTimestamp: Date,

    val issueDescription: String,

    @Enumerated(EnumType.STRING)
    var priority: TicketPriority?,

    @Enumerated(EnumType.STRING)
    var status: TicketStatusValues,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expert_id")
    var expert: Expert?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    var order: Order,

    @ManyToOne(fetch = FetchType.LAZY)
    var customer: Customer,

    val category: String,

    var rating: Int?
)
