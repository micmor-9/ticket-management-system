package it.polito.wa2.g35.server.products

import java.util.Date

data class ProductDTO(
    val id: String,
    val name: String,
    var description: String?,
    var price: Double?,
    var quantity: Int?,
    val warrantyDuration: Date
)
{
    constructor() : this("","", "", 0.0, 0, Date())
}

fun Product.toDTO(): ProductDTO {
    return ProductDTO(this.id, this.name, this.description, this.price, this.quantity, this.warrantyDuration)
}

fun ProductDTO.toProduct(): Product {
    return Product(this.id, this.name, this.description, this.price, this.quantity, this.warrantyDuration)
}
