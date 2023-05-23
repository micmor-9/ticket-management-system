package it.polito.wa2.g35.server.authentication

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class AuthExceptions: ResponseEntityExceptionHandler() {
    @ExceptionHandler(InvalidUserCredentialsException::class)
    fun handleInvalidUserCredentials(e: InvalidUserCredentialsException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.UNAUTHORIZED, e.message!!)
}

class InvalidUserCredentialsException(message : String) : RuntimeException(message)
