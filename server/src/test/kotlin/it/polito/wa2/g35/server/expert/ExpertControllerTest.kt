package it.polito.wa2.g35.server.expert

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.products.ProductRepository
import it.polito.wa2.g35.server.profiles.customer.CustomerRepository
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.employee.expert.*
import it.polito.wa2.g35.server.ticketing.order.OrderRepository
import it.polito.wa2.g35.server.ticketing.order.OrderService
import org.junit.jupiter.api.Assertions
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


@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class ExpertControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var customerRepository: CustomerRepository

    @Autowired
    lateinit var expertRepository: ExpertRepository

    @Autowired
    lateinit var expertService: ExpertService

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
        expertRepository.deleteAll()
        customerRepository.deleteAll()
    }


    @Test
    fun `create a new Expert`() {
        val expert = Expert("10", "Luca", "Ruberto", "luca10@example.it", "Boh")
        val expertDto = expert.toDTO()

        val result = mockMvc.perform(
            MockMvcRequestBuilders.post("/API/experts")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(expertDto))
        ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()

        val returnedExpert = objectMapper.readValue(result.response.contentAsString, ExpertDTO::class.java)
        Assertions.assertEquals(expertDto.id, returnedExpert.id)
        Assertions.assertEquals(expertDto.name, returnedExpert.name)
        Assertions.assertEquals(expertDto.surname, returnedExpert.surname)
        Assertions.assertEquals(expertDto.email, returnedExpert.email)
        Assertions.assertEquals(expertDto.specialization, returnedExpert.specialization)
    }

    @Test
    fun `create a new Expert with existing id`() {
        val expert = Expert("2", "Luca", "Ruberto", "luca2@example.it", "Boh")
        val expertDto = expert.toDTO()
        expertService.createExpert(expertDto)
        val expert2 = Expert("2", "Luca", "Ruberto", "luca2@example.it", "Boh")
        val expert2Dto = expert2.toDTO()
        //expertService.createExpert(expertDto)
        mockMvc.perform(
            MockMvcRequestBuilders.post("/API/experts")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(expert2Dto))
        ).andExpect(MockMvcResultMatchers.status().isConflict)

    }

    @Test
    fun `get a Expert by valid expertId`(){
        expertRepository.deleteAll()
        val expert = Expert("3", "Luca", "Ruberto", "luca3@example.it", "Boh")
        val expertDto = expert.toDTO()
        expertService.createExpert(expertDto)

        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/experts/${expert.id}")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(expertDto))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.jsonPath("$.id").value("3"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Luca"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.surname").value("Ruberto"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.email").value("luca3@example.it"))
            .andExpect(MockMvcResultMatchers.jsonPath("$.specialization").value("Boh"))

    }


    @Test
    fun `get a Expert by valid specialization`() {
        expertRepository.deleteAll()
        val expert = Expert("4", "Luca", "Ruberto", "luca4@example.it", "Ah")
        val expertDto = expert.toDTO()
        expertService.createExpert(expertDto)
        val expert2 = Expert("5", "Luca", "Rubert", "luca5@example.it", "Ah")
        val expert2Dto = expert2.toDTO()
        expertService.createExpert(expert2Dto)
        mockMvc.perform(
            MockMvcRequestBuilders.get("/API/experts/specialization/${expert.specialization}")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(expertDto))
        ).andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value("4"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Luca"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].surname").value("Ruberto"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].email").value("luca4@example.it"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[0].specialization").value("Ah"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].id").value("5"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Luca"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].surname").value("Rubert"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].email").value("luca5@example.it"))
            .andExpect(MockMvcResultMatchers.jsonPath("$[1].specialization").value("Ah"))
    }


}