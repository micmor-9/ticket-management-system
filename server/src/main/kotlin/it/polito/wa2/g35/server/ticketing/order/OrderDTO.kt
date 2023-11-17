package it.polito.wa2.g35.server.ticketing.order

import it.polito.wa2.g35.server.products.Product
import it.polito.wa2.g35.server.profiles.customer.Customer
import java.util.*

data class OrderDTO (
    val id: Long?,
    val customer: Customer,
    val product: Product,
    val quantity: Int?,
    val date: Date,
    val warrantyDuration: Date
)

fun Order.toDTO() : OrderDTO {
    return OrderDTO(this.id, this.customer, this.product, this.quantity, this.date, this.warrantyDuration)
}

fun OrderDTO.toOrder() : Order {
    return Order(this.id, this.date, this.warrantyDuration, this.customer, this.product, this.quantity)
}