package hu.hollo.news.exception

import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import javax.validation.ConstraintViolationException

sealed class ApiException(msg: String, val code: Int) : Exception(msg)
@ControllerAdvice
class DefaultExceptionHandler {
    @ExceptionHandler(value = [ApiException::class])
    fun onApiException(ex: ApiException, response: HttpServletResponse) =
        response.sendError(ex.code, ex.message)


    @ExceptionHandler(value = [NotImplementedError::class])
    fun onNotImplemented(ex: NotImplementedError, response: HttpServletResponse) =
        response.sendError(HttpStatus.NOT_IMPLEMENTED.value())

    @ExceptionHandler(value = [ConstraintViolationException::class])
    fun onConstraintViolation(ex: ConstraintViolationException, response: HttpServletResponse) =
        response.sendError(HttpStatus.BAD_REQUEST.value(), ex.constraintViolations.joinToString(", ") { it.message })
}
