package it.polito.wa2.g35.server.product

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.ProductDTO
import it.polito.wa2.g35.server.products.ProductRepository
import it.polito.wa2.g35.server.products.ProductService
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProductControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var productRepository: ProductRepository

    @Autowired
    lateinit var productService: ProductService
    companion object {
        @Container
        val postgres = PostgreSQLContainer("postgres:latest")

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url", postgres::getJdbcUrl)
            registry.add("spring.datasource.username", postgres::getUsername)
            registry.add("spring.datasource.password", postgres::getPassword)
            registry.add("spring.jpa.hibernate.ddl-auto") { "create-drop" }
        }
    }

    @BeforeEach
    fun beforeEach() {
        productRepository.deleteAll()
    }

    @Test
    fun `Create a Product` (){
        val product = ProductDTO("prod1", "Ciao")

        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.post("/API/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(ObjectMapper().writeValueAsString(product))
            ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()

        val content = result.response.contentAsString
        val createdProduct = objectMapper.readValue(content, ProductDTO::class.java)

        Assertions.assertEquals(product.id, createdProduct.id)
        Assertions.assertEquals(product.name, createdProduct.name)

    }

    @Test
    fun `Create a Product with already existing id` (){
        val product = ProductDTO("1", "Ciao")
        productService.createProduct(product)
        mockMvc
            .perform(
                MockMvcRequestBuilders.post("/API/products")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(product))
            ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()


    }

    @Test
    fun `Get a Product by valid Id` (){
        val product = ProductDTO("prod1", "Ciao")
        productService.createProduct(product)

        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/products/prod1")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

    }

    @Test
    fun `Get a Product by invalid Id` (){
        val product = ProductDTO("prod1", "Ciao")
        productService.createProduct(product)

        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/products/prod2")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").doesNotExist())
            .andReturn()

    }
    @Test
    fun `Get all Products` (){
        val product = ProductDTO("prod1", "Ciao")
        productService.createProduct(product)
        val product2 = ProductDTO("prod2", "Ciao2")
        productService.createProduct(product2)
        val product3 = ProductDTO("prod3", "Ciao3")
        productService.createProduct(product3)
        val product4 = ProductDTO("prod4", "Ciao4")
        productService.createProduct(product4)
        val product5 = ProductDTO("prod5", "Ciao5")
        productService.createProduct(product5)


        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/products/")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val products = objectMapper.readValue(content, Array<ProductDTO>::class.java)
        Assertions.assertEquals(5, products.size)
        Assertions.assertEquals(product.id, products[0].id)
        Assertions.assertEquals(product2.id, products[1].id)
        Assertions.assertEquals(product3.id, products[2].id)
        Assertions.assertEquals(product4.id, products[3].id)
        Assertions.assertEquals(product5.id, products[4].id)
        Assertions.assertEquals(product.name, products[0].name)
        Assertions.assertEquals(product2.name, products[1].name)
        Assertions.assertEquals(product3.name, products[2].name)
        Assertions.assertEquals(product4.name, products[3].name)
        Assertions.assertEquals(product5.name, products[4].name)

    }

}