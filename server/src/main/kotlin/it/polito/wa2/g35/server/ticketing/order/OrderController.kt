package it.polito.wa2.g35.server.ticketing.order

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = ["http://localhost:5000"])
class OrderController(private val orderService: OrderService) {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @GetMapping("/orders/{customerId}/{productId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager')")
    @Observed(
        name = "/orders/{customerId}/{productId}",
        contextualName = "get-order-by-customer-and-product-request"
    )
    fun getOrderByCustomerAndProduct(@PathVariable customerId: String, @PathVariable productId: String): OrderDTO? {
        log.info("Get order by Customer and Product request successful")
        return orderService.getOrderByCustomerAndProduct(customerId, productId)
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager', 'Expert')")
    @Observed(
        name = "/order/{orderId}",
        contextualName = "get-order-by-id-request"
    )
    fun getOrderByOrderId(@PathVariable orderId: String): OrderDTO? {
        log.info("Get order by id request successful")
        return orderService.getOrderByOrderId(orderId)
    }

    @GetMapping("/orders")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('Manager')")
    @Observed(
        name = "/orders",
        contextualName = "get-orders-request"
    )
    fun getOrders(): List<OrderDTO>? {
        log.info("Get orders request successful")
        return orderService.getOrders()
    }

    @GetMapping("/orders/{customerId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager')")
    @Observed(
        name = "/orders/{customerId}",
        contextualName = "get-orders-by-customer-request"
    )
    fun getOrdersByCustomer(@PathVariable customerId: String): List<OrderDTO>?{
        log.info("Get orders by Customer request successful")
        return orderService.getOrdersByCustomer(customerId)
    }

    @PostMapping("/orders/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Client')")
    @Observed(
        name = "/orders/",
        contextualName = "post-order-request"
    )
    fun createOrder(@RequestBody order: OrderInputDTO): OrderDTO? {
        log.info("Create order request successful")
        return orderService.createOrder(order)
    }
}