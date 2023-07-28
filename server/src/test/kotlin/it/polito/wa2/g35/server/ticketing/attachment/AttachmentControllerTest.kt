package it.polito.wa2.g35.server.ticketing.attachment

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.*
import it.polito.wa2.g35.server.profiles.customer.*
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertRepository
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.toDTO
import it.polito.wa2.g35.server.messages.MessageInputDTO
import it.polito.wa2.g35.server.messages.MessageService
import it.polito.wa2.g35.server.ticketing.order.OrderInputDTO
import it.polito.wa2.g35.server.ticketing.order.OrderRepository
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.ticket.*
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusRepository
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
import java.util.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.springframework.test.annotation.DirtiesContext

@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class AttachmentControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var orderService: OrderService

    @Autowired
    lateinit var ticketService: TicketService

    @Autowired
    lateinit var ticketRepository: TicketRepository

    @Autowired
    lateinit var customerService: CustomerService



    @Autowired
    lateinit var productService: ProductService

    @Autowired
    lateinit var attachmentService: AttachmentService

    @Autowired
    lateinit var attachmentRepository: AttachmentRepository

    @Autowired
    lateinit var messageRepository: AttachmentRepository

    @Autowired
    lateinit var messageService: MessageService

    @Autowired
    lateinit var expertRepository: ExpertRepository

    @Autowired
    lateinit var productRepository: ProductRepository


    @Autowired
    lateinit var customerRepository: CustomerRepository


    @Autowired
    lateinit var orderRepository: OrderRepository

    @Autowired
    lateinit var ticketStatusRepository:TicketStatusRepository

    @Autowired
    lateinit var  expertService:ExpertService


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
                    attachmentRepository.deleteAll()
                    messageRepository.deleteAll()
                    ticketStatusRepository.deleteAll()
                    ticketRepository.deleteAll()
                    orderRepository.deleteAll()
                    expertRepository.deleteAll()
                    productRepository.deleteAll()
                    customerRepository.deleteAll()
            val expert1 = Expert("1", "Mimmo", "Lello", "1@example.it", "Fiche strette")
        val product1 = Product("1", "Product 1")
        val customer1 = Customer("prova@example.it", "Franco", "Galati")
        val order1 = OrderInputDTO(null, "prova@example.it", "1", Date(), Date(Date().time + 2 * 60 * 60 * 1000))
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
        expertService.createExpert(expert1.toDTO())
        productService.createProduct(product1.toDTO())
        customerService.createCustomer(customer1.toDTO())
        orderService.createOrder(order1)
        ticketService.createTicket(ticket1)
    }


    @Test
    fun `Get attachment by Id` (){
        // Given
        val ticketList = ticketService.getAll()
        val message = messageService.postMessage(MessageInputDTO(null, Date(), "Ciao", ticketList[0].id!!, "Expert"))
        val attachment = attachmentService.postAttachment(AttachmentInputDTO(null, message?.id!!, "Boh"))
        // Wheg
        val result = mockMvc.perform(MockMvcRequestBuilders.get("/API/attachments/${attachment?.id}")
            .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        //Then
        val returnedAttachment = objectMapper.readValue(result.response.contentAsString, AttachmentDTO::class.java)

        assertEquals(attachment?.id, returnedAttachment?.id)
        assertEquals(attachment?.message?.id, returnedAttachment?.message?.id)
        assertEquals(attachment?.fileContent, returnedAttachment?.fileContent)
    }

    @Test
    fun `Get attachment by message Id`(){
        val ticketList = ticketService.getAll()

        messageService.postMessage(MessageInputDTO(null, Date(), "Ciao", ticketList[0].id!!, "Expert"))
        val messageList = messageService.getMessagesByTicket(ticketList[0].id!!)
        val attachmentInput = AttachmentInputDTO(null, messageList[0].id!! , "Boh")
        val attachment = attachmentService.postAttachment(attachmentInput)
        val result = mockMvc.perform(MockMvcRequestBuilders.get("/API/attachments/message/${messageList[0].id}")
            .contentType(MediaType.APPLICATION_JSON)
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        //Then
        val returnedAttachment = objectMapper.readValue(result.response.contentAsString, Array<AttachmentDTO>::class.java)

        assertEquals(attachment?.id, returnedAttachment[0].id)
        assertEquals(attachment?.message?.id, returnedAttachment[0].message.id)
        assertEquals(attachment?.fileContent, returnedAttachment[0].fileContent)
    }

    @Test
    fun `Post attachment by Id` (){
        val ticketList = ticketService.getAll()

        messageService.postMessage(MessageInputDTO(null, Date(), "Ciao", ticketList[0].id!!, "Expert"))
        val messageList = messageService.getMessagesByTicket(ticketList[0].id!!)
        val attachmentInput = AttachmentInputDTO(null, messageList[0].id!! , "Boh")

        // Wheg

        val result = mockMvc.perform(
            MockMvcRequestBuilders.post("/API/attachments")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(attachmentInput))
        ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()
        val attach = attachmentService.getAttachmentsByMessageById(attachmentInput.messageId)
        assertEquals(1,attach.size)
    }


}