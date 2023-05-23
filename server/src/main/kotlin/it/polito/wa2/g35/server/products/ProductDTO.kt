package it.polito.wa2.g35.server.products

data class ProductDTO(
    val id: String,
    val name: String
)
{
    constructor() : this("","")
}

fun Product.toDTO(): ProductDTO {
    return ProductDTO(this.id, this.name)
}

fun ProductDTO.toProduct(): Product {
    return Product(this.id, this.name)
}
