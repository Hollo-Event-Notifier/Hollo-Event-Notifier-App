package hu.hollo.news.controller

import hu.hollo.news.api.UsersApi
import hu.hollo.news.model.dto.CreateUserRequestDto
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
import java.util.*
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@RestController
class UsersController(
    private val userService: UserService,
    @Value("\${auth_cookie_name}") private val cookieName: String
) : UsersApi {

    override fun login(userCredentialsDto: UserCredentialsDto): ResponseEntity<UserDto> {
        val (currentUser, token) = userService.loginUser(userCredentialsDto)
        return ResponseEntity
            .ok()
            .headers {
                it.set(
                    HttpHeaders.SET_COOKIE,
                    ResponseCookie // TODO: add all necessary security restrictions
                        .from(cookieName, token.tokenValue)
                        .httpOnly(false) // TODO: should be addressed later
                        .secure(false) // TODO: add when HTTPS setup
                        .sameSite(SameSite.STRICT.attributeValue())
                        .path("/")
                        .maxAge(1.hours.toJavaDuration())
                        .build().toString()
                )
            }
            .body(currentUser)
    }

    override fun checkToken(): ResponseEntity<UserDto> = ResponseEntity.ok(
        userService.getCurrentUser(getJwtToken())
    )

    override fun getAllUsers(): ResponseEntity<List<UserDto>> = ResponseEntity.ok(
        userService.getAllUsers(
            getJwtToken()
        )
    )

    override fun updateUser(userDto: UserDto): ResponseEntity<UserDto> =
        ResponseEntity.ok(
            userService.updateUser(
                userDto, getJwtToken()
            )
        )

    override fun createUser(createUserRequestDto: CreateUserRequestDto): ResponseEntity<UserDto> =
        ResponseEntity.ok(
            userService.createUser(
                createUserRequestDto, getJwtToken()
            )
        )

    override fun deleteUserById(id: UUID): ResponseEntity<Unit> {
        userService.deleteUser(id, getJwtToken())
        return ResponseEntity.noContent().build()
    }

    private fun getJwtToken(): Jwt =
        SecurityContextHolder.getContext().authentication.principal as Jwt
}