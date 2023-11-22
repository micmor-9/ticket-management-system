package it.polito.wa2.g35.server.ticketing.ticket


import java.util.*

class TicketInputDTO (
    val id: Long?,
    val creationTimestamp: Date?,
    val issueDescription: String,
    val priority: String?,
    val status: String? = TicketStatusValues.OPEN.name,
    val expertId: String?,
    val orderId: String,
    var customerId: String,
    var category: String
   )