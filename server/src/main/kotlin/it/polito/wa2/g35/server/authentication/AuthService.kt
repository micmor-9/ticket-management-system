package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertDTO

interface AuthService {
    fun signupCustomer(request: SignupCustomerRequest) : CustomerDTO?
    fun signupExpert(request: SignupExpertRequest) : ExpertDTO?
    fun login(request: AuthRequest) : AuthResponse?
}