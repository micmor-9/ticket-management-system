package it.polito.wa2.g35.server.ticketing.ticket

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.*
import it.polito.wa2.g35.server.profiles.customer.*
import it.polito.wa2.g35.server.profiles.employee.expert.*
import it.polito.wa2.g35.server.ticketing.attachment.AttachmentDTO
import it.polito.wa2.g35.server.ticketing.attachment.AttachmentInputDTO
import it.polito.wa2.g35.server.ticketing.message.MessageInputDTO
import it.polito.wa2.g35.server.ticketing.order.OrderInputDTO
import it.polito.wa2.g35.server.ticketing.order.OrderRepository
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.ticketStatus.*
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
import org.springframework.test.annotation.DirtiesContext


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class TicketStatusControllerTest {
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

    @Autowired
    lateinit var ticketStatusService: TicketStatusService

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
        val ticket = ticketService.createTicket(
            TicketInputDTO(
                1,
                Date(),
                "description",
                null,
                TicketStatusValues.OPEN.name,
                "1",
                "1",
                "prova@example.it"
            )
        )
    }

    @Test
    fun `Create Ticket Status` (){
        val ticketToPass = TicketStatus(1,Date(), TicketStatusValues.valueOf("OPEN"),"",null,null)
        val requestBody = objectMapper.writeValueAsString(ticketToPass)

        mockMvc.perform(
            MockMvcRequestBuilders
                .post("/API/status/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody)
        ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()

        assertEquals(1, ticketStatusRepository.count())
    }

    @Test
    fun `Get Ticket Status` (){
        val ticketToPass1 = TicketStatus(1,Date(), TicketStatusValues.valueOf("OPEN"),"",Ticket(
                    1,
                    Date(),
                    "description",
                    null,
                    TicketStatusValues.valueOf("OPEN"),
                    null,
                    Product("1","Product 1"),
                    Customer("prova@example.it","Franco","Galati")
                ),null)
        ticketStatusService.createTicketStatus(ticketToPass1.toDTO())

        val result = mockMvc.perform(MockMvcRequestBuilders.get("/API/status/${ticketToPass1?.ticket?.id}")
            .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        //Then
        val returnedList = objectMapper.readValue(result.response.contentAsString, Array<TicketStatusDTO>::class.java)
        assertEquals(1, returnedList.size)
        }


}