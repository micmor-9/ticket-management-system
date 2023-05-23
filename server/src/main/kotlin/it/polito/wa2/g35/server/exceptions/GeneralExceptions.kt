package it.polito.wa2.g35.server.exceptions

import org.springframework.http.HttpStatus
import org.springframework.http.ProblemDetail
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class GeneralExceptions: ResponseEntityExceptionHandler() {
    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequestException(e: BadRequestException) = ProblemDetail
        .forStatusAndDetail(HttpStatus.BAD_REQUEST, e.message!!)
}

class BadRequestException(message : String) : RuntimeException(message)

