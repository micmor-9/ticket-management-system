package it.polito.wa2.g35.server.ticketing.order

import java.util.*

data class OrderInputDTO (
    val id: Long?,
    val customerId: String,
    val productId: String,
    val date: Date,
    val warrantyDuration: Date
)

