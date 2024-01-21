package it.polito.wa2.g35.server.products

interface ProductService {
    fun getAll(): List<ProductDTO>
    fun getAllCategories(): List<String?>
    fun getProductById(productId: String): ProductDTO?
    fun createProduct(product: ProductDTO?): ProductDTO?
    fun updateProduct(product: ProductDTO?): ProductDTO?
    fun updateProductAvailability(productId: String, quantity: Int): ProductDTO?

}