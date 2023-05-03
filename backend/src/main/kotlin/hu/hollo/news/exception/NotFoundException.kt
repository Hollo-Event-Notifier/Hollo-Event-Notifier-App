package hu.hollo.news.exception

import org.springframework.http.HttpStatus

open class NotFoundException(msg: String, code: Int = HttpStatus.NOT_FOUND.value()) : ApiException(msg, code)
