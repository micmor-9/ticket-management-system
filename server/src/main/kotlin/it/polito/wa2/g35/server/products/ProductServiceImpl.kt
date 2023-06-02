package it.polito.wa2.g35.server.products

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service // responsible for the business logic
class ProductServiceImpl(
    private val productRepository: ProductRepository
) : ProductService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @Observed(
        name = "/products/",
        contextualName = "get-products-request-service"
    )
    override fun getAll(): List<ProductDTO> {
        log.info("Get products from repository request successful")
        return productRepository.findAll().map { it.toDTO() }
    }
    @Observed(
        name = "/products/{productId}",
        contextualName = "get-product-by-id-request-service"
    )
    override fun getProductById(productId: String): ProductDTO? {
        val product = productRepository.findByIdOrNull(productId)?.toDTO()
        if(product != null) {
            log.info("Get product by Id from repository request successful")
            return product
        }
        else {
            log.error("Product not found with this product id!")
            throw ProductNotFoundException("Product not found with this product id!")
        }
    }
    @Observed(
        name = "/products",
        contextualName = "post-product-request-service"
    )
    override fun createProduct(product: ProductDTO?): ProductDTO? {
        return if (product != null) {
            val checkIfProductExists = productRepository.findByIdOrNull(product.id)
            if(checkIfProductExists == null) {
                log.info("Create product request successful (repository)")
                productRepository.save(Product(product.id, product.name)).toDTO()
            } else {
                log.error("Product with given id already exists!")
                throw DuplicateProductException("Product with given id already exists!")
            }
        } else {
            null
        }
    }
}