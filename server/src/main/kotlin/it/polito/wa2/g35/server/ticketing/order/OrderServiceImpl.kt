package it.polito.wa2.g35.server.ticketing.order

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.products.ProductNotFoundException
import it.polito.wa2.g35.server.products.ProductService
import it.polito.wa2.g35.server.products.toProduct
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class OrderServiceImpl(private val orderRepository: OrderRepository) : OrderService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @Autowired
    lateinit var customerService: CustomerService

    @Autowired
    lateinit var productService: ProductService

    private fun filterResultByRole(auth: Authentication, resultOrder: OrderDTO?) : OrderDTO? {
        when (auth.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                return resultOrder
            }
            SecurityConfig.CLIENT_ROLE -> {
                if (resultOrder?.customer?.email == auth.name)
                    return resultOrder
                else
                    log.error("Unauthorized access to Order")
                    throw UnauthorizedOrderException("You can't access this Order!")
            }

            else -> {
                return null
            }
        }
    }

    private fun filterListResultByRole(auth: Authentication, resultList: List<OrderDTO>?) : List<OrderDTO> {
        return when (auth.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                resultList ?: emptyList()
            }

            SecurityConfig.CLIENT_ROLE -> {
                resultList?.filter { it.customer.email == auth.name } ?: emptyList()
            }
            else -> {
                emptyList()
            }
        }
    }
    @Observed(
        name = "/orders",
        contextualName = "get-orders-request-service"
    )
    override fun getOrders(): List<OrderDTO> {
        log.info("Get orders from repository request successful")
        return orderRepository.findAll().map { it.toDTO() }
    }

    @Observed(
        name = "/order/{orderId}",
        contextualName = "get-order-by-id-request-service"
    )
    override fun getOrderByOrderId(orderId: String) : OrderDTO? {
        log.info("Get order by id from repository request successful")
        println(orderId.toLong())
        return orderRepository.findById(orderId.toLong()).map { it.toDTO() }.orElse(null)
    }

    @Observed(
        name = "/orders/{customerId}",
        contextualName = "get-orders-by-customer-request"
    )
    override fun getOrdersByCustomer(idCustomer: String): List<OrderDTO> {
        val authentication = SecurityContextHolder.getContext().authentication
        val profile = customerService.getCustomerByEmail(idCustomer)
        if(profile == null){
            log.error("No Profile found with this Id: $idCustomer")
            throw ProfileNotFoundException("Profile not found with this id!")
        }
        val orders = orderRepository.getOrdersByCustomerEmail(idCustomer).map { it.toDTO() }
        log.info("Get orders by Customer from repository successful")
        return filterListResultByRole(authentication,orders)
    }

    override fun getOrderByCustomerAndProduct(idCustomer: String, idProduct: String): OrderDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val order = orderRepository.getOrdersByCustomerAndProduct(idCustomer, idProduct)?.toDTO()
        log.info("Get order by Customer and Product request from repository successful")
        return filterResultByRole(authentication,order)
    }

    @Observed(
        name = "/orders/",
        contextualName = "post-order-request-service"
    )
    override fun createOrder(order: OrderInputDTO): OrderDTO? {
        val customer = customerService.getCustomerByEmail(order.customerId)
        if(customer == null){
            log.error("No Customer found with this Id: $order.customerId")
            throw ProfileNotFoundException("Profile not found with this id!")
        }
        val product = productService.getProductById(order.productId)
        if(product == null){
            log.error("No Product found with this Id: $order.productId")
            throw ProductNotFoundException("Product not found with this id!")
        }
        productService.updateProductAvailability(order.productId, order.quantity)
        log.info("Create order request successful (repository9")

        return orderRepository.save(
            Order(
                null,
                order.date,
                order.warrantyDuration,
                customer.toCustomer(),
                product.toProduct(),
                order.quantity
            )
        ).toDTO()
    }

}