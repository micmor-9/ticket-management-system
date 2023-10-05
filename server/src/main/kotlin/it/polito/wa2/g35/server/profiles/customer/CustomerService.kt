package it.polito.wa2.g35.server.profiles.customer

interface CustomerService {

    fun getCustomerId(customerEmail: String) : CustomerDTO?
    fun getCustomerByEmail(email: String) : CustomerDTO?

    fun createCustomer(profile: CustomerDTO?) : CustomerDTO?

    fun updateCustomer(profile: CustomerDTO?) : CustomerDTO?

    fun getAllCustomers(): List<CustomerDTO>?
}