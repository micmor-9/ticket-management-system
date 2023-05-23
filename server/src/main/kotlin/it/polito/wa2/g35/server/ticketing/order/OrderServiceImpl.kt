package it.polito.wa2.g35.server.ticketing.order

import it.polito.wa2.g35.server.products.ProductNotFoundException
import it.polito.wa2.g35.server.products.ProductService
import it.polito.wa2.g35.server.products.toProduct
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.security.SecurityConfig
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class OrderServiceImpl(private val orderRepository: OrderRepository) : OrderService {

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

    override fun getOrders(): List<OrderDTO> {
        return orderRepository.findAll().map { it.toDTO() }
    }

    override fun getOrdersByCustomer(idCustomer: String): List<OrderDTO> {
        val authentication = SecurityContextHolder.getContext().authentication
        customerService.getCustomerByEmail(idCustomer)
            ?: throw ProfileNotFoundException("Profile not found with this id!")

        val orders = orderRepository.getOrdersByCustomerEmail(idCustomer).map { it.toDTO() }
        return filterListResultByRole(authentication,orders)
    }

    override fun getOrderByCustomerAndProduct(idCustomer: String, idProduct: String): OrderDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val order = orderRepository.getOrdersByCustomerAndProduct(idCustomer, idProduct)?.toDTO()
        return filterResultByRole(authentication,order)
    }

    override fun createOrder(order: OrderInputDTO): OrderDTO? {
        val customer = customerService.getCustomerByEmail(order.customerId) ?: throw ProfileNotFoundException("Profile not found with this id!")
        val product = productService.getProductById(order.productId) ?: throw ProductNotFoundException("Product not found with this id!")

        return orderRepository.save(
            Order(
                null,
                order.date,
                order.warrantyDuration,
                customer.toCustomer(),
                product.toProduct()
            )
        ).toDTO()
    }

}