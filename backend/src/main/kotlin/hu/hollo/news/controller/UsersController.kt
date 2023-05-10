package hu.hollo.news.controller

import hu.hollo.news.api.UsersApi
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.service.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.server.Cookie.SameSite
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.RestController
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@RestController
class UsersController(
    private val userService: UserService,
    @Value("\${auth_cookie_name}") private val cookieName: String
) : UsersApi {

    override fun login(userCredentialsDto: UserCredentialsDto): ResponseEntity<Unit> =
        ResponseEntity
            .ok()
            .headers {
                it.set(
                    HttpHeaders.SET_COOKIE,
                    ResponseCookie // TODO: add all neccessary security restrictions
                        .from(cookieName, userService.loginUser(userCredentialsDto).tokenValue)
                        .httpOnly(false) // TODO: should be addressed later
                        .secure(false) // TODO: add when HTTPS setup
                        .sameSite(SameSite.STRICT.attributeValue())
                        .path("/")
                        .maxAge(1.hours.toJavaDuration())
                        .build().toString()
                )
            }
            .build()

    override fun checkToken(): ResponseEntity<Unit> = ResponseEntity.ok().build()

    override fun getAllUsers(): ResponseEntity<List<UserDto>> = ResponseEntity.ok(userService.getAllUsers())

    override fun updateUser(userDto: UserDto): ResponseEntity<UserDto> =
        ResponseEntity.ok(
            userService.updateUser(
                userDto, SecurityContextHolder.getContext().authentication.principal as Jwt
            )
        )
}