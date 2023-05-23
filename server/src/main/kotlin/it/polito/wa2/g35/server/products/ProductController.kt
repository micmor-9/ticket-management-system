package it.polito.wa2.g35.server.products

import it.polito.wa2.g35.server.exceptions.BadRequestException
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.validation.BindingResult
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class ProductController(private val productService: ProductService) {
    @GetMapping("/products/")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    fun getAll(): List<ProductDTO> {
        return productService.getAll()
    }

    @GetMapping("/products/{productId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @ResponseStatus(HttpStatus.OK)
    fun getProduct(@PathVariable productId: String): ProductDTO? {
        return productService.getProductById(productId)
    }

    @PostMapping("/products")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    fun postProduct(
        @RequestBody @Valid p: ProductDTO,
        br: BindingResult
    ) : ProductDTO? {
        if (br.hasErrors())
            throw BadRequestException("Bad request format!")
        else
            return productService.createProduct(p)
    }
}