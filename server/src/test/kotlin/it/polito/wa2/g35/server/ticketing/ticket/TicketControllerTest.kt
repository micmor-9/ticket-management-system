package it.polito.wa2.g35.server.ticketing.ticket

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.*
import it.polito.wa2.g35.server.profiles.customer.*
import it.polito.wa2.g35.server.profiles.employee.expert.*
import it.polito.wa2.g35.server.ticketing.order.OrderInputDTO
import it.polito.wa2.g35.server.ticketing.order.OrderRepository
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
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
import java.util.*

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class TicketControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var ticketService: TicketService

    @Autowired
    lateinit var ticketRepository: TicketRepository

    @Autowired
    lateinit var expertService: ExpertService

    @Autowired
    lateinit var expertRepository: ExpertRepository

    @Autowired
    lateinit var productService: ProductService

    @Autowired
    lateinit var productRepository: ProductRepository

    @Autowired
    lateinit var customerService: CustomerService

    @Autowired
    lateinit var customerRepository: CustomerRepository

    @Autowired
    lateinit var orderService: OrderService

    @Autowired
    lateinit var orderRepository: OrderRepository

    @Autowired
    lateinit var ticketStatusRepository: TicketStatusRepository


    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
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
        ticketRepository.deleteAll()
        orderRepository.deleteAll()
        expertRepository.deleteAll()
        productRepository.deleteAll()
        customerRepository.deleteAll()
        val expert1 = Expert("1", "John", "Doe", "1@example.it", "automotive")
        val product1 = Product("1", "Product 1")
        val customer1 = Customer("prova@example.it", "Franco", "Galati")
        val order1 = OrderInputDTO(null, "prova@example.it", "1", Date(), Date(Date().time + 2 * 60 * 60 * 1000))
        expertService.createExpert(expert1.toDTO())
        productService.createProduct(product1.toDTO())
        customerService.createCustomer(customer1.toDTO())
        orderService.createOrder(order1)
    }

    @Test
    fun testGetEmptyTicketList() {
        // Given
        ticketRepository.deleteAll()
        // When
        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/tickets")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        // Then
        assertEquals("[]", result.response.contentAsString)
    }

    @Test
    fun testThreeTicketList() {
        val ticket1 = TicketInputDTO(
            null,
            null,
            "description 1",
            TicketPriority.LOW.name,
            TicketStatusValues.OPEN.name,
            "1",
            "1",
            "prova@example.it"
        )
        val ticket2 = TicketInputDTO(
            null,
            null,
            "description 2",
            TicketPriority.MEDIUM.name,
            TicketStatusValues.OPEN.name,
            "1",
            "1",
            "prova@example.it"
        )
        val ticket3 = TicketInputDTO(
            null,
            null,
            "description 3",
            TicketPriority.HIGH.name,
            TicketStatusValues.CLOSED.name,
            "1",
            "1",
            "prova@example.it"
        )
        ticketService.createTicket(ticket1)
        ticketService.createTicket(ticket2)
        ticketService.createTicket(ticket3)

        // When
        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/tickets")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = ObjectMapper().readValue(content, Array<TicketDTO>::class.java)
        assertEquals(3, tickets.size)
    }

    @Test
    fun testGetTicketById() {
        // Given
        val ticket = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description",
                null,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        // When
        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/${ticket?.id}")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        // Then
        val returnedTicket = objectMapper.readValue(result.response.contentAsString, TicketDTO::class.java)
        assertEquals(ticket?.id, returnedTicket.id)
        assertEquals(ticket?.creationTimestamp, returnedTicket.creationTimestamp)
        assertEquals(ticket?.issueDescription, returnedTicket.issueDescription)
        assertEquals(ticket?.status, returnedTicket.status)
        assertEquals(ticket?.expert?.id, returnedTicket.expert?.id)
        assertEquals(ticket?.product?.id, returnedTicket.product.id)
        assertEquals(ticket?.customer?.email, returnedTicket.customer.email)
        assertEquals(ticket?.priority, returnedTicket.priority)
    }

    @Test
    fun testCreateTicket() {
        ticketRepository.deleteAll()
        val ticket = TicketInputDTO(
            null,
            null,
            "description",
            null,
            TicketStatusValues.OPEN.name,
            "1",
            "1",
            "prova@example.it"
        )

        val requestBody = objectMapper.writeValueAsString(ticket)

        mockMvc.perform(
            MockMvcRequestBuilders
                .post("/API/tickets/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
        ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()

        assertEquals(1, ticketRepository.count())
    }

    @Test
    fun testCreateTicketWithoutOrder() {
        ticketRepository.deleteAll()
        orderRepository.deleteAll()
        val ticket = TicketInputDTO(
            null,
            null,
            "description",
            null,
            TicketStatusValues.OPEN.name,
            "1",
            "1",
            "prova@example.it"
        )

        val requestBody = objectMapper.writeValueAsString(ticket)

        mockMvc.perform(
            MockMvcRequestBuilders
                .post("/API/tickets/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andReturn()
    }

    @Test
    fun testCreateTicketWithWarrantyExpired() {
        val dateCreation = Date()
        ticketRepository.deleteAll()
        orderRepository.deleteAll()
        orderService.createOrder(
            OrderInputDTO(
                null,
                "prova@example.it",
                "1",
                dateCreation,
                dateCreation
            )
        )
        val ticket = TicketInputDTO(
            null,
            null,
            "description",
            null,
            TicketStatusValues.OPEN.name,
            "1",
            "1",
            "prova@example.it"
        )

        val requestBody = objectMapper.writeValueAsString(ticket)

        mockMvc.perform(
            MockMvcRequestBuilders
                .post("/API/tickets/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }

    @Test
    fun testGetTicketsByStatus() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                TicketPriority.LOW.name,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/status/open")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = objectMapper.readValue(content, Array<TicketDTO>::class.java)

        assertEquals(1, tickets.size)
        assertEquals(ticket1?.id, tickets[0].id)
    }

    @Test
    fun testGetTicketsByStatusWrong() {
        ticketRepository.deleteAll()
        ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                TicketPriority.LOW.name,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/status/wrong")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()

    }

    @Test
    fun testGetTicketsByExpert() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                TicketPriority.LOW.name,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )
        ticketService.updateTicket(
            TicketInputDTO(
                ticket1?.id,
                null,
                "description 2",
                ticket1?.priority?.name,
                TicketStatusValues.IN_PROGRESS.name,
                "1",
                ticket1?.product?.id.toString(),
                ticket1?.customer?.email.toString()
            )
        )

        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/expert/1")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = objectMapper.readValue(content, Array<TicketDTO>::class.java)
        assertEquals(1, tickets.size)
        assertEquals(ticket1?.id, tickets[0].id)
    }

    @Test
    fun testGetTicketsByExpertWrong() {
        ticketRepository.deleteAll()
        ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                TicketPriority.LOW.name,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/expert/99")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andReturn()
    }

    @Test
    fun testGetTicketsByPriority() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                TicketPriority.LOW.name,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        ticketService.updateTicketPriority(ticket1?.id!!, TicketPriority.HIGH.name)

        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/priority/high")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = objectMapper.readValue(content, Array<TicketDTO>::class.java)
        assertEquals(1, tickets.size)
        assertEquals(ticket1.id, tickets[0].id)
    }

    @Test
    fun testGetTicketsByPriorityEmpty() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        ticketService.updateTicketPriority(ticket1?.id!!, TicketPriority.HIGH.name)

        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/priority/low")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = objectMapper.readValue(content, Array<TicketDTO>::class.java)
        assertEquals(0, tickets.size)
    }

    @Test
    fun testGetTicketsByPriorityWrong() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )

        ticketService.updateTicketPriority(ticket1?.id!!, TicketPriority.HIGH.name)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/priority/wrong")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }

    @Test
    fun testGetTicketsByCustomer() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        val result = mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/customer/${ticket1?.customer?.email}")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val tickets = objectMapper.readValue(content, Array<TicketDTO>::class.java)
        assertEquals(1, tickets.size)
        assertEquals(ticket1?.id, tickets[0].id)
    }

    @Test
    fun testGetTicketsByCustomerWrong() {
        ticketRepository.deleteAll()
        ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/tickets/customer/wrong@wrong.it")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andReturn()
    }

    @Test
    fun testUpdateTicket() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        val result = mockMvc.perform(
            MockMvcRequestBuilders.put("/API/tickets/${ticket1?.id}")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        TicketInputDTO(
                            ticket1?.id,
                            null,
                            "description 2",
                            TicketPriority.LOW.name,
                            TicketStatusValues.IN_PROGRESS.name,
                            "1",
                            ticket1?.product?.id.toString(),
                            ticket1?.customer?.email.toString()
                        )
                    )
                )
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val ticket = objectMapper.readValue(content, TicketDTO::class.java)

        assertEquals(ticket?.status?.name, TicketStatusValues.IN_PROGRESS.name)
        assertEquals(ticket?.priority?.name, TicketPriority.LOW.name)
    }

    @Test
    fun testUpdateTicketConflict() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.put("/API/tickets/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        TicketInputDTO(
                            ticket1?.id,
                            null,
                            "description 2",
                            TicketPriority.LOW.name,
                            TicketStatusValues.IN_PROGRESS.name,
                            "1",
                            ticket1?.product?.id.toString(),
                            ticket1?.customer?.email.toString()
                        )
                    )
                )
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }

    @Test
    fun testUpdateTicketStatus() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.patch("/API/tickets/${ticket1?.id}/status/in_progress")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val ticket = ticketService.getTicketById(ticket1?.id!!)

        assertEquals(ticket?.status?.name, TicketStatusValues.IN_PROGRESS.name)
    }

    @Test
    fun testUpdateTicketStatusWrong() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.patch("/API/tickets/${ticket1?.id}/status/wrong")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }

    @Test
    fun testUpdateTicketStatusFlowConflict() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.patch("/API/tickets/${ticket1?.id}/status/reopened")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }

    @Test
    fun testUpdateTicketPriority() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.patch("/API/tickets/${ticket1?.id}/priority/medium")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val ticket = ticketService.getTicketById(ticket1?.id!!)

        assertEquals(ticket?.priority?.name, TicketPriority.MEDIUM.name)
    }

    @Test
    fun testUpdateTicketPriorityWrong() {
        ticketRepository.deleteAll()
        val ticket1 = ticketService.createTicket(
            TicketInputDTO(
                null,
                null,
                "description 1",
                null,
                TicketStatusValues.OPEN.name,
                null,
                "1",
                "prova@example.it"
            )
        )

        mockMvc.perform(
            MockMvcRequestBuilders.patch("/API/tickets/${ticket1?.id}/priority/wrong")
                .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isConflict)
            .andReturn()
    }
}
