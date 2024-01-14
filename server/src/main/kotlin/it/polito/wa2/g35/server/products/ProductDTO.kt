package it.polito.wa2.g35.server.products

data class ProductDTO(
    val id: String,
    val name: String,
    var description: String?,
    var price: Double?,
    var quantity: Int?,
    val warrantyDuration: Int?
) {
    constructor() : this("", "", "", 0.0, 0, 0)
}

fun Product.toDTO(): ProductDTO {
    return ProductDTO(this.id, this.name, this.description, this.price, this.quantity, this.warrantyDuration)
}

fun ProductDTO.toProduct(): Product {
    return Product(this.id, this.name, this.description, this.price, this.quantity, this.warrantyDuration)
}
