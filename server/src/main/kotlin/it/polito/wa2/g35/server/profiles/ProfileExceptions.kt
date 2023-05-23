package it.polito.wa2.g35.server.profiles

import it.polito.wa2.g35.server.ticketing.ticket.UnauthorizedTicketException
import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class ProfileExceptions: ResponseEntityExceptionHandler() {
    @ExceptionHandler(ProfileNotFoundException::class)
    fun handleProfileNotFound(e: ProfileNotFoundException) = ProblemDetail
        .forStatusAndDetail( HttpStatus.NOT_FOUND, e.message!!)
    @ExceptionHandler(DuplicateProfileException::class)
    fun handleDuplicateProduct(e: DuplicateProfileException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.CONFLICT, e.message!!)
    @ExceptionHandler(UnauthorizedProfileException::class)
    fun handleUnauthorizedTicketException(e: UnauthorizedProfileException) = ProblemDetail
        .forStatusAndDetail( HttpStatus.FORBIDDEN, e.message!!)

}

class DuplicateProfileException(message : String) : RuntimeException(message)
class ProfileNotFoundException(message : String) : RuntimeException(message)
class UnauthorizedProfileException(message : String ) : RuntimeException(message)
