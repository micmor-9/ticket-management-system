package it.polito.wa2.g35.server.products

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.exceptions.BadRequestException
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import jakarta.validation.Valid
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class ProductController(private val productService: ProductService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @GetMapping("/products/")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @Observed(
        name = "/products/",
        contextualName = "get-products-request"
    )
    fun getAll(): List<ProductDTO> {
        log.info("Get products request successful")
        return productService.getAll()
    }

    @GetMapping("/products/{productId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @ResponseStatus(HttpStatus.OK)
    @Observed(
        name = "/products/{productId}",
        contextualName = "get-product-by-id-request"
    )
    fun getProduct(@PathVariable productId: String): ProductDTO? {
        log.info("Get product by Id request successful")
        return productService.getProductById(productId)
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "/products",
        contextualName = "post-product-request"
    )
    fun postProduct(
        @RequestBody @Valid p: ProductDTO,
        br: BindingResult
    ) : ProductDTO? {
        if (br.hasErrors()) {
            log.error("Create Product request failed by bad request format")
            throw BadRequestException("Bad request format!")
        }
        else {
            log.info("Create Product request successful")
            return productService.createProduct(p)
        }
    }
}