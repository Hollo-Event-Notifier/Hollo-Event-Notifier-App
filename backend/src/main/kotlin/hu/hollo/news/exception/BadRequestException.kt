package hu.hollo.news.exception

import org.springframework.http.HttpStatus

class BadRequestException(msg: String) : ApiException(msg, HttpStatus.BAD_REQUEST.value())
