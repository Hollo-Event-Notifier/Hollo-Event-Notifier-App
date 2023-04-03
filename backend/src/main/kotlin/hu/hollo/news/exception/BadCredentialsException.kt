package hu.hollo.news.exception

import org.springframework.http.HttpStatus

class BadCredentialsException : ApiException("", HttpStatus.UNAUTHORIZED.value())