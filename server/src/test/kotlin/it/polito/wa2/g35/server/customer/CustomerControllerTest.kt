package it.polito.wa2.g35.server.customer

import com.fasterxml.jackson.databind.ObjectMapper
import it.polito.wa2.g35.server.profiles.customer.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Assertions.assertEquals
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
class CustomerControllerTest {
    @Autowired
    lateinit var mockMvc: MockMvc

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var customerRepository: CustomerRepository

    @Autowired
    lateinit var customerService: CustomerService

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
        customerRepository.deleteAll()
    }

    @Test
    fun testGetProfileByEmail() {
        val customer = customerService.createCustomer(
            CustomerDTO(
                "test@customer.it",
                "test",
                "customer"
            )
        )

        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/profiles/${customer?.email}")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val createdCustomer = objectMapper.readValue(content, CustomerDTO::class.java)

        assertEquals(customer?.email, createdCustomer.email)
        assertEquals(customer?.name, createdCustomer.name)
        assertEquals(customer?.surname, createdCustomer.surname)
    }

    @Test
    fun testGetProfileByEmailWrong() {
        customerService.createCustomer(
            CustomerDTO(
                "test@customer.it",
                "test",
                "customer"
            )
        )

        mockMvc
            .perform(
                MockMvcRequestBuilders.get("/API/profiles/wrong")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andReturn()
    }

    @Test
    fun testCreateCustomer() {
        val customer = CustomerDTO(
            "test@customer.it",
            "test",
            "customer"
        )

        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.post("/API/profiles")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customer))
            ).andExpect(MockMvcResultMatchers.status().isCreated)
            .andReturn()

        val content = result.response.contentAsString
        val createdCustomer = objectMapper.readValue(content, CustomerDTO::class.java)

        assertEquals(customer.email, createdCustomer.email)
        assertEquals(customer.name, createdCustomer.name)
        assertEquals(customer.surname, createdCustomer.surname)
    }

    @Test
    fun testUpdateCustomer() {
        val customer = customerService.createCustomer(
            CustomerDTO(
                "test@customer.it",
                "test",
                "customer"
            )
        )

        val customerToUpdate = CustomerDTO(
            "test@customer.it",
            "updated",
            "values"
        )

        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.put("/API/profiles/test@customer.it")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customerToUpdate))
            ).andExpect(MockMvcResultMatchers.status().isOk)
            .andReturn()

        val content = result.response.contentAsString
        val updatedCustomer = objectMapper.readValue(content, CustomerDTO::class.java)

        assertEquals(customerToUpdate.email, updatedCustomer.email)
        assertEquals(customerToUpdate.name, updatedCustomer.name)
        assertEquals(customerToUpdate.surname, updatedCustomer.surname)
    }

    @Test
    fun testUpdateCustomerWrong() {
        val customer = customerService.createCustomer(
            CustomerDTO(
                "test@customer.it",
                "test",
                "customer"
            )
        )

        val customerToUpdate = CustomerDTO(
            "test@customer.it",
            "updated",
            "values"
        )

        val result = mockMvc
            .perform(
                MockMvcRequestBuilders.put("/API/profiles/wrong")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(customerToUpdate))
            ).andExpect(MockMvcResultMatchers.status().isNotFound)
            .andReturn()
    }
}