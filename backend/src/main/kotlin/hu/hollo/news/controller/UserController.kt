package hu.hollo.news.controller

import hu.hollo.news.api.UserApi
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.service.UserService
import org.springframework.boot.web.server.Cookie.SameSite
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@RestController
class UserController(private val userService: UserService) : UserApi {
    override fun loginUser(userCredentialsDto: UserCredentialsDto): ResponseEntity<Unit> =
        ResponseEntity
            .ok()
            .headers {
                it.set(
                    HttpHeaders.SET_COOKIE,
                    ResponseCookie
                        .from("X-AUTH-TOKEN", userService.loginUser(userCredentialsDto).tokenValue)
                        .httpOnly(false) // should be addressed later
                        .secure(false) // add when HTTPS setup
                        .sameSite(SameSite.STRICT.attributeValue())
                        .path("/")
                        .maxAge(1.hours.toJavaDuration())
                        .build().toString()
                )
            }
            .build()

}