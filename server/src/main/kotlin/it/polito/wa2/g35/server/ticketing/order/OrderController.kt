package it.polito.wa2.g35.server.ticketing.order

import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000"])
class OrderController(private val orderService: OrderService) {
    @GetMapping("/orders/{customerId}/{productId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager')")
    fun getOrderByCustomerAndProduct(@PathVariable customerId: String, @PathVariable productId: String): OrderDTO? {
        return orderService.getOrderByCustomerAndProduct(customerId, productId)
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('Manager')")
    fun getOrders(): List<OrderDTO>? {
        return orderService.getOrders()
    }

    @GetMapping("/orders/{customerId}")
    @PreAuthorize("hasAnyRole('Client', 'Manager')")
    fun getOrdersByCustomer(@PathVariable customerId: String): List<OrderDTO>?{
        return orderService.getOrdersByCustomer(customerId)
    }

    @PostMapping("/orders/")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('Manager')")
    fun createOrder(@RequestBody order: OrderInputDTO): OrderDTO? {
        return orderService.createOrder(order)
    }
}