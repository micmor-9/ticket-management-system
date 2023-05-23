package it.polito.wa2.g35.server.ticketing.order

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class OrderExceptions: ResponseEntityExceptionHandler() {
    @ExceptionHandler(OrderNotFoundException::class)
    fun handleProductNotFound(e: OrderNotFoundException) = ProblemDetail
        .forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!!)
    @ExceptionHandler(WarrantyExpiredException::class)
    fun handleWarrantyExpired(e: WarrantyExpiredException) = ProblemDetail
        .forStatusAndDetail( HttpStatus.CONFLICT, e.message!!)
}

class OrderNotFoundException(message : String) : RuntimeException(message)
class WarrantyExpiredException(message: String) : RuntimeException(message)
class UnauthorizedOrderException(message: String) : RuntimeException(message)

