package hu.hollo.news.exception

import org.springframework.http.HttpStatus

class ForbiddenException(msg: String) : ApiException(msg, HttpStatus.FORBIDDEN.value())