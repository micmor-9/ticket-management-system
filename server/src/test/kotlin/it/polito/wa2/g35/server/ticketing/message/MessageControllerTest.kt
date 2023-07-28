package it.polito.wa2.g35.server.ticketing.message

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.messages.MessageInputDTO
import it.polito.wa2.g35.server.messages.MessageRepository
import it.polito.wa2.g35.server.messages.MessageService
import it.polito.wa2.g35.server.products.*
import it.polito.wa2.g35.server.profiles.customer.*
import it.polito.wa2.g35.server.profiles.employee.expert.*
import it.polito.wa2.g35.server.ticketing.order.OrderInputDTO
import it.polito.wa2.g35.server.ticketing.order.OrderRepository
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.ticket.*
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusRepository
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.BeforeEach
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
@DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
class MessageControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var messageService: MessageService

    @Autowired
    lateinit var messageRepository: MessageRepository

    @Autowired
    lateinit var ticketRepository: TicketRepository

    @Autowired
    lateinit var productService: ProductService

    @Autowired
    lateinit var customerService: CustomerService

    @Autowired
    lateinit var ticketService: TicketService

    @Autowired
    lateinit var customerRepository: CustomerRepository

    @Autowired
    lateinit var expertRepository: ExpertRepository

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Autowired
    lateinit var orderService: OrderService

    @Autowired
    lateinit var ticketStatusRepository: TicketStatusRepository

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
    fun beforeEach() {
        ticketStatusRepository.deleteAll()
        messageRepository.deleteAll()
        ticketRepository.deleteAll()
        orderRepository.deleteAll()
        customerRepository.deleteAll()
        expertRepository.deleteAll()
        productRepository.deleteAll()

        // CREATE CUSTOMERS
        val customer1 = Customer(
            "michele.galati@example.com",
            "michele",
            "galati"
        )

        customerService.createCustomer(customer1.toDTO())

        // CREATE PRODUCTS
        val product1 = Product(
            "prod1",
            "iPhone 11 pro",
        )

        productService.createProduct(product1.toDTO())

        // TIMESTAMP
        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val timestamp1 = dateFormat.parse("2022-03-02")

        val warrantyDate1 = dateFormat.parse("2025-01-31")

        val order1 = OrderInputDTO(
            null,
            "michele.galati@example.com",
            "prod1",
            timestamp1,
            warrantyDate1
        )
        orderService.createOrder(order1)

    }

    @Test
    fun `get message by ticketId`(){
        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val date1 = dateFormat.parse("2022-05-02")
        val date2 = dateFormat.parse("2022-05-02")

        val ticket = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "prod1",
                "michele.galati@example.com"
            )
        )

        val message1 = MessageInputDTO(
            1,
            date1,
            "schermo distrutto",
            ticket?.id!!,
            "antonio"
        )
        val message2 = MessageInputDTO(
            2,
            date2,
            "la mia batteria non funziona!",
            ticket.id!!,
            "raffaele"
        )
        messageService.postMessage(message1)
        messageService.postMessage(message2)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/messages/${ticket.id}")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(message1.id))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value(message2.id))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].messageText").value(message1.messageText))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].messageText").value(message2.messageText))
            .andExpect(MockMvcResultMatchers.jsonPath("$").isArray)
            .andExpect(MockMvcResultMatchers.jsonPath("$", hasSize<Any>(2)))
    }

    @Test
    fun `get message by ticketId Not Found`(){
        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val date1 = dateFormat.parse("2022-05-02")
        val date2 = dateFormat.parse("2022-05-02")

        val ticket = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "prod1",
                "michele.galati@example.com"
            )
        )

        val message1 = MessageInputDTO(
            1,
            date1,
            "schermo distrutto",
            ticket?.id!!,
            "antonio"
        )
        val message2 = MessageInputDTO(
            2,
            date2,
            "la mia batteria non funziona!",
            ticket.id!!,
            "raffaele"
        )
        messageService.postMessage(message1)
        messageService.postMessage(message2)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/messages/123")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
    }

    @Test
    fun `create new message`() {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val date1 = dateFormat.parse("2022-05-02")

        val ticket = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "prod1",
                "michele.galati@example.com"
            )
        )

        val message1 = MessageInputDTO(
            1,
            date1,
            "schermo distrutto",
            ticket?.id!!,
            "antonio"
        )

        mockMvc.perform(
            MockMvcRequestBuilders.post("/API/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ObjectMapper().writeValueAsString(message1))
        ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
            .andExpect(MockMvcResultMatchers.jsonPath("$.messageText").value(message1.messageText))
            .andExpect(MockMvcResultMatchers.jsonPath("$.ticket.id").value(message1.ticket))
            .andExpect(MockMvcResultMatchers.jsonPath("$.sender").value(message1.sender))
    }
    @Test
    fun `create new message with wrong ticketId`() {
        val dateFormat = SimpleDateFormat("yyyy-MM-dd")
        val date1 = dateFormat.parse("2022-05-02")

        val message1 = MessageInputDTO(
            1,
            date1,
            "schermo distrutto",
            100,
            "antonio"
        )

        mockMvc.perform(
            MockMvcRequestBuilders.post("/API/messages")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ObjectMapper().writeValueAsString(message1))
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").doesNotExist())
    }
}