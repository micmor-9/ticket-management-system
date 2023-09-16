package it.polito.wa2.g35.server.messages

import it.polito.wa2.g35.server.ticketing.attachment.Attachment
import it.polito.wa2.g35.server.ticketing.ticket.Ticket
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "message")
class Message(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false)
    var id: Long? = null,

    @Temporal(TemporalType.TIMESTAMP)
    val messageTimestamp: Date?,

    val messageText: String,

    @ManyToOne(fetch = FetchType.LAZY)
    var ticket: Ticket?,

    var sender: String?,

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "attachment_id", referencedColumnName = "id")
    var attachment: Attachment?
)