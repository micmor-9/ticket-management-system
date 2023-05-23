package it.polito.wa2.g35.server.ticketing.ticketStatus

import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.ticketing.ticket.Ticket
import it.polito.wa2.g35.server.ticketing.ticket.TicketStatusValues
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "ticketStatus")
class TicketStatus(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false)
    var id: Long? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val statusTimestamp: Date?,

    @Enumerated(EnumType.STRING)
    val status: TicketStatusValues?,

    val description: String?,

    @ManyToOne(fetch = FetchType.LAZY)
    var ticket: Ticket?,

    @ManyToOne(fetch = FetchType.LAZY)
    var expert: Expert?,
    )
