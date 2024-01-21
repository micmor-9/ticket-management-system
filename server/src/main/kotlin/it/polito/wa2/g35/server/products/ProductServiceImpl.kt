package it.polito.wa2.g35.server.products

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.profiles.UnauthorizedProfileException
import it.polito.wa2.g35.server.security.SecurityConfig
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service // responsible for the business logic
class ProductServiceImpl(
    private val productRepository: ProductRepository
) : ProductService {
    private val log: Logger = LoggerFactory.getLogger(javaClass)

    @Observed(
        name = "/products/",
        contextualName = "get-products-request-service"
    )
    override fun getAll(): List<ProductDTO> {
        log.info("Get products from repository request successful")
        return productRepository.findAll().map { it.toDTO() }
    }

    @Observed(
        name = "/categories/",
        contextualName = "get-product-categories-request-service"
    )
    override fun getAllCategories(): List<String?> {
        log.info("Get products from repository request successful")
        return productRepository.findAll().map { it.description }.distinct()
    }

    @Observed(
        name = "/products/{productId}",
        contextualName = "get-product-by-id-request-service"
    )
    override fun getProductById(productId: String): ProductDTO? {
        val product = productRepository.findByIdOrNull(productId)?.toDTO()
        if (product != null) {
            log.info("Get product by Id from repository request successful")
            return product
        } else {
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
            if (checkIfProductExists == null) {
                log.info("Create product request successful (repository)")
                productRepository.save(
                    Product(
                        product.id,
                        product.name,
                        product.description,
                        product.price,
                        product.quantity,
                        product.warrantyDuration
                    )
                ).toDTO()
            } else {
                log.error("Product with given id already exists!")
                throw DuplicateProductException("Product with given id already exists!")
            }
        } else {
            null
        }
    }

    @Observed(
        name = "/products/{id}",
        contextualName = "put-product-request-service"
    )
    override fun updateProduct(product: ProductDTO?): ProductDTO? {
        return if (product != null) {
            val currentProduct = getProductById(product.id)?.toProduct()
            if (currentProduct != null) {
                val authentication = SecurityContextHolder.getContext().authentication
                if (authentication.authorities.map { it.authority }[0] == SecurityConfig.MANAGER_ROLE) {
                    log.info("Update Product request successful (repository)")
                    productRepository.save(
                        Product(
                            product.id, product.name, product.description,
                            product.price, product.quantity, product.warrantyDuration
                        )
                    ).toDTO()
                } else {
                    log.error("Update Product request failed by unauthorized access")
                    throw UnauthorizedProfileException("You can't access this product!")
                }
            } else {
                log.error("Product with given id doesn't exists!")
                throw ProductNotFoundException("Product with given id doesn't exists!")
            }
        } else {
            log.error("Update Product request failed")
            null
        }
    }

    @Observed(
        name = "/products/{productId}",
        contextualName = "put-product-request-service"
    )
    override fun updateProductAvailability(productId: String, quantity: Int): ProductDTO? {
        val product = productRepository.findByIdOrNull(productId)
        if (product != null) {
            log.info("Update product availability request successful (repository)")
            product.quantity = product.quantity?.minus(quantity)
            productRepository.save(product)
            return product.toDTO()
        } else {
            log.error("Product not found with this product id!")
            throw ProductNotFoundException("Product not found with this product id!")
        }
    }
}