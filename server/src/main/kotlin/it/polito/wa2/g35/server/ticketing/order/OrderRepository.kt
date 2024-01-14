package it.polito.wa2.g35.server.ticketing.order

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : JpaRepository<Order, Long> {

    fun getOrdersByCustomerEmail(idCustomer: String): List<Order>

    //@Query("SELECT t FROM Order t WHERE t.customer.email = :idCustomer AND t.product.id = :idProduct")
    //fun getOrdersByCustomerAndProduct(idCustomer: String, idProduct: String): List<Order>?
}