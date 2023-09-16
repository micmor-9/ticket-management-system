package it.polito.wa2.g35.server.ticketing.attachment

import it.polito.wa2.g35.server.messages.Message
import jakarta.persistence.*

@Entity
@Table(name = "attachment")
class Attachment(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(updatable = false, nullable = false)
    var id: Long? = null,

    /*@OneToOne(mappedBy = "attachment")
    val message: Message,*/

    @Column(nullable = false)
    val fileName: String,

    @Column(nullable = false)
    val fileType: String,

    @Column(nullable = false)
    val fileSize: Double,

    @Lob
    @Column(nullable = false)
    val fileContent: ByteArray,
)