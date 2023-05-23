package it.polito.wa2.g35.server.ticketing.order

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.*
import it.polito.wa2.g35.server.profiles.customer.*
import net.minidev.json.JSONArray
import org.junit.jupiter.api.BeforeEach
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import java.text.SimpleDateFormat


@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Autowired
    lateinit var orderService: OrderService

    @Autowired
    lateinit var customerRepository: CustomerRepository

    @Autowired
    lateinit var customerService: CustomerService

    @Autowired
    lateinit var productService: ProductService

    @Autowired
    lateinit var productRepository: ProductRepository

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
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    fun beforeEach() {
        orderRepository.deleteAll()
        customerRepository.deleteAll()
        productRepository.deleteAll()

        // CREATE CUSTOMERS
        val customer1 = CustomerDTO(
            "michele.galati@example.com",
            "michele",
            "galati"
        )
        val customer2 = CustomerDTO(
            "roberto.diciaula@example.com",
            "roberto",
            "di ciaula"
        )
        val customer3 = CustomerDTO(
            "michele.morgigno@example.com",
            "michele",
            "morgigno"
        )
        customerService.createCustomer(customer1)
        customerService.createCustomer(customer2)
        customerService.createCustomer(customer3)

        // CREATE PRODUCTS
        val product1 = ProductDTO(
            "prod1",
            "iPhone 11 pro",
        )
        val product2 = ProductDTO(
            "prod2",
            "MacBook Pro 14",
        )
        val product3 = ProductDTO(
            "prod3",
            "Samsung Galaxy S21",
        )
        productService.createProduct(product1)
        productService.createProduct(product2)
        productService.createProduct(product3)
    }

    @Test
    fun createNewOrder () {
        // Given
        //orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val date = dateFormat.parse("2022-05-02")
        val warrantyDate = dateFormat.parse("2023-05-02")

        val order = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date,
            warrantyDate
        )
        orderService.createOrder(order)

        // When
        mockMvc.perform(
            MockMvcRequestBuilders.post("/API/orders/")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order))
        )
            .andExpect(MockMvcResultMatchers.status().isCreated)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$.customer.email").value("michele.galati@example.com"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.customer.name").value("michele"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.customer.surname").value("galati"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.product.id").value("prod1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.product.name").value("iPhone 11 pro"))
    }

    @Test
    fun `get order by valid customerEmail and productId`() {
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.morgigno@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        val customerId = "michele.galati@example.com"
        val productId = "prod1"
        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders/$customerId/$productId")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$.customer.email").value("michele.galati@example.com"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.product.id").value("prod1"))
    }

    @Test
    fun `get order by invalid customerEmail`() {
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.morgigno@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        val customerId = "michelle.galati@example.com"
        val productId = "prod1"
        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders/$customerId/$productId")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").doesNotExist())
    }

    @Test
    fun `get order by invalid productId`() {
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.morgigno@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        val customerId = "michele.galati@example.com"
        val productId = "prod2"
        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders/$customerId/$productId")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").doesNotExist())
    }

    @Test
    fun `get all tickets `() {
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.morgigno@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.jsonPath("$", isA<Array<Any>>(JSONArray::class.java)))
            .andExpect(MockMvcResultMatchers.jsonPath("$", hasSize<Any>(3)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].customer.email").value("michele.galati@example.com"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].product.id").value("prod1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].customer.email").value("michele.morgigno@example.com"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].product.id").value("prod2"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[2].id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$[2].customer.email").value("roberto.diciaula@example.com"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[2].product.id").value("prod3"))
    }

    @Test
    fun `get order by valid customerId`(){
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        val customer = CustomerDTO(
            "michele.galati@example.com",
            "michele",
            "galati",
        )

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders/${customer.email}")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.jsonPath("$", isA<Array<Any>>(JSONArray::class.java)))
            .andExpect(MockMvcResultMatchers.jsonPath("$", hasSize<Any>(2)))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].product.id").value("prod1"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].product.id").value("prod2"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].customer.name").value(customer.name))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].customer.surname").value(customer.surname))
    }

    @Test
    fun `get order by invalid customerId`(){
        orderRepository.deleteAll()

        val dateFormat = SimpleDateFormat("yyyy-MM-dd")


        val date1 = dateFormat.parse("2022-03-02")
        val date2 = dateFormat.parse("2021-01-31")
        val date3 = dateFormat.parse("2020-02-28")
        val warrantyDate1 = dateFormat.parse("2023-03-02")
        val warrantyDate2 = dateFormat.parse("2025-01-31")
        val warrantyDate3 = dateFormat.parse("2021-08-28")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            date1,
            warrantyDate1
        )
        val order2 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod2",
            date2,
            warrantyDate2
        )
        val order3 = OrderInputDTO(
            null,
            "roberto.diciaula@example.com",
            "prod3",
            date3,
            warrantyDate3
        )
        orderService.createOrder(order1)
        orderService.createOrder(order2)
        orderService.createOrder(order3)

        val customer = CustomerDTO(
            "michelle.galati@example.com",
            "michele",
            "galati",
        )

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/orders/${customer.email}")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(order1))
        ).andExpect(MockMvcResultMatchers.status().isNotFound)

    }
}


