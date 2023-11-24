package it.polito.wa2.g35.server.products

import it.polito.wa2.g35.server.profiles.customer.CustomerDTO

interface ProductService {
    fun getAll() : List<ProductDTO>
    fun getProductById(productId: String) : ProductDTO?
    fun createProduct(product: ProductDTO?) : ProductDTO?
    fun updateProduct(product: ProductDTO?) : ProductDTO?
}