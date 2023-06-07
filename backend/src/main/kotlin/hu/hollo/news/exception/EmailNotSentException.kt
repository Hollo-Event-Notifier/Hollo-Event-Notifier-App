package hu.hollo.news.exception

import org.springframework.http.HttpStatus

class EmailNotSentException(message: String): ApiException(message, HttpStatus.INTERNAL_SERVER_ERROR.value())