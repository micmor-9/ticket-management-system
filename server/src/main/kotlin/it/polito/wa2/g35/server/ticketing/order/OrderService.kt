package it.polito.wa2.g35.server.ticketing.order

interface OrderService {
    fun getOrders(): List<OrderDTO>

    //fun getOrderById(id: String): OrderDTO?

    //fun getOrderByProduct(idProduct : String): OrderDTO?

    fun getOrdersByCustomer(idCustomer: String): List<OrderDTO>

    fun getOrderByCustomerAndProduct(idCustomer: String, idProduct: String): OrderDTO?

    fun getOrderByOrderId(orderId: String) : OrderDTO?

    fun createOrder(order: OrderInputDTO): OrderDTO?

}
