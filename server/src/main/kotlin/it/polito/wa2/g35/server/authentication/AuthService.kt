package it.polito.wa2.g35.server.authentication

import it.polito.wa2.g35.server.profiles.customer.CustomerDTO
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertDTO
import org.springframework.http.ResponseEntity

interface AuthService {
    fun signupCustomer(signupRequest: SignupCustomerRequest) : CustomerDTO?
    fun signupExpert(signupRequest: SignupExpertRequest) : ExpertDTO?
    fun login(loginRequest: AuthRequest) : AuthResponse?

    fun resetPassw(email: String) : Boolean

    fun changePassword(request: ChangePasswordRequest): Boolean
}