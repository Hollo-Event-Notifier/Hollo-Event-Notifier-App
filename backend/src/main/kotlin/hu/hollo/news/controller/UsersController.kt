package hu.hollo.news.controller

import hu.hollo.news.api.UsersApi
import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.model.dto.UserRegistrationDto
import hu.hollo.news.service.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.web.server.Cookie.SameSite
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.bind.annotation.RestController
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.util.*
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@RestController
class UsersController(
    private val userService: UserService,
    @Value("\${auth_cookie_name}") private val cookieName: String,
    private val templateEngine: TemplateEngine
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

    override fun registerUser(userRegistrationDto: UserRegistrationDto): ResponseEntity<Unit> =
        ResponseEntity.created(userService.registerUser(userRegistrationDto)).build()


    // TODO: redirect to localhost:4200 accept
    @GetMapping("/users/approve/{id}")
    @ResponseBody
    fun getUser(@PathVariable id: UUID, model: Model): String {
        val context = Context()
        userService.approveUser(id)
        return templateEngine.process("page/user_accepted.html", context)
    }

    private fun getJwtToken(): Jwt =
        SecurityContextHolder.getContext().authentication.principal as Jwt
}