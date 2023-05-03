package hu.hollo.news.controller

import hu.hollo.news.exception.BadCredentialsException
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.service.UserService
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.mockito.Mockito.*
import org.springframework.boot.web.server.Cookie.SameSite
import org.springframework.http.HttpHeaders
import org.springframework.http.ResponseCookie
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.jwt.Jwt
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

internal class UsersControllerTest {
    private lateinit var userServiceMock: UserService
    private lateinit var underTest: UsersController
    private val tokenNameStub = "X-AUTH-TOKEN"

    @BeforeEach
    fun setUp() {
        userServiceMock = mock(UserService::class.java)
        underTest = UsersController(userServiceMock, tokenNameStub)
    }

    @Nested
    @DisplayName("loginUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class LoginUser {
        @Test
        fun `should authenticate user successfully`() {
            val userDtoStub = UserCredentialsDto("username", "password")
            val jwtMock = mock(Jwt::class.java)
            val tokenValueStub = "stub-token-value"
            `when`(jwtMock.tokenValue).thenReturn(tokenValueStub)
            `when`(userServiceMock.loginUser(userDtoStub)).thenReturn(jwtMock)

            val expected = ResponseCookie
                .from(tokenNameStub, tokenValueStub)
                .httpOnly(false)
                .secure(false)
                .sameSite(SameSite.STRICT.attributeValue())
                .path("/")
                .maxAge(1.hours.toJavaDuration())
                .build().let {
                    listOf(
                        "${it.name}=${it.value}",
                        "SameSite=${it.sameSite}",
                        "Path=${it.path}",
                        "Max-Age=${it.maxAge.seconds}"
                    )
                }

            // act
            val got = underTest.login(userDtoStub)

            val gotCookieAttributes = got.headers[HttpHeaders.SET_COOKIE]?.let {
                it[0].split("; ")
            }!!

            val gotExtraAttributes = gotCookieAttributes.filter { !expected.contains(it) }


            // assert
            assertTrue(gotCookieAttributes.containsAll(expected))
            assertEquals(1, gotExtraAttributes.size)
        }

        @Test
        fun `shouldn't find user`() {
            // arrange
            val userDtoStub = UserCredentialsDto("username", "password")
            val usernameStub = "stub username"
            val exceptionStub = UsernameNotFoundException(usernameStub)

            `when`(userServiceMock.loginUser(userDtoStub))
                .thenAnswer { throw exceptionStub }

            // act
            val got = assertThrows<UsernameNotFoundException> { underTest.login(userDtoStub) }

            // assert
            assertEquals(exceptionStub, got)
        }

        @Test
        fun `shouldn't authenticate due to incorrect password`() {
            val userDtoStub =  UserCredentialsDto("username", "password")
            val exceptionStub = BadCredentialsException()

            `when`(userServiceMock.loginUser(userDtoStub)).thenAnswer { throw exceptionStub }

            // act
            val got = assertThrows<BadCredentialsException> { underTest.login(userDtoStub) }

            // assert
            assertEquals(exceptionStub, got)
        }
    }


}