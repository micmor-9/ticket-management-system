package it.polito.wa2.g35.server.profiles.customer

interface CustomerService {

    fun getCustomerById(id: Int) : CustomerDTO?
    fun getCustomerByEmail(email: String) : CustomerDTO?

    fun createCustomer(profile: CustomerDTO?) : CustomerDTO?

    fun updateCustomer(profile: CustomerDTO?) : CustomerDTO?
}