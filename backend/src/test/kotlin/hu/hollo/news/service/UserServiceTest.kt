package hu.hollo.news.service

import hu.hollo.news.exception.BadCredentialsException
import hu.hollo.news.model.db.User
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.repository.UserRepository
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.mockito.Mockito.*
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtEncoder

internal class UserServiceTest {

    private lateinit var jwtEncoderMock: JwtEncoder
    private lateinit var passwordEncoderMock: PasswordEncoder
    private lateinit var repositoryMock: UserRepository
    private lateinit var underTest: UserService

    @BeforeEach
    fun setUp() {
        jwtEncoderMock = mock(JwtEncoder::class.java)
        passwordEncoderMock = mock(PasswordEncoder::class.java)
        repositoryMock = mock(UserRepository::class.java)

        underTest = UserService(
            jwtEncoderMock,
            passwordEncoderMock,
            repositoryMock
        )
    }

    @Nested
    @DisplayName("loginUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class LoginUser {
        @Test
        fun `should return token`() {
            // arrange
            val usernameStub = "username"
            val passwordStub = "password"
            val userCredentialsDtoStub = UserCredentialsDto(usernameStub, passwordStub)
            val userStub = User(
                usernameStub,
                passwordStub,
                "email@email.com",
            )
            val jwtMock = mock(Jwt::class.java)
            `when`(repositoryMock.findByUsername(userCredentialsDtoStub.username))
                .thenReturn(userStub)
            `when`(passwordEncoderMock.matches(passwordStub, passwordStub))
                .thenReturn(true)
            `when`(jwtEncoderMock.encode(any())).thenReturn(jwtMock)

            // act
            val got = underTest.loginUser(userCredentialsDtoStub)

            // assert
            assertEquals(jwtMock, got)
        }

        @Test
        fun `shouldn't find user'`() {
            // arrange
            val usernameStub = "username"
            val passwordStub = "password"
            val userCredentialsDtoStub = UserCredentialsDto(usernameStub, passwordStub)
            `when`(repositoryMock.findByUsername(userCredentialsDtoStub.username))
                .thenReturn(null)

            // act
            val got = assertThrows<BadCredentialsException> { underTest.loginUser(userCredentialsDtoStub) }

            // assert
            assertEquals(got.message, "")
            assertEquals(got.code, HttpStatus.UNAUTHORIZED.value())
        }

        @Test
        fun `shouldn't authenticate user'`() {
            // arrange
            val usernameStub = "username"
            val passwordStub = "password"
            val userCredentialsDtoStub = UserCredentialsDto(usernameStub, passwordStub)
            val userStub = User(
                usernameStub,
                passwordStub,
                "email@email.com",
            )
            `when`(repositoryMock.findByUsername(userCredentialsDtoStub.username))
                .thenReturn(userStub)
            `when`(repositoryMock.findByUsername(userCredentialsDtoStub.username))
                .thenReturn(userStub)
            `when`(passwordEncoderMock.matches(passwordStub, passwordStub))
                .thenReturn(false)

            // act
            val got = assertThrows<BadCredentialsException> { underTest.loginUser(userCredentialsDtoStub) }

            // assert
            assertEquals(got.message, "")
            assertEquals(got.code, HttpStatus.UNAUTHORIZED.value())
        }
    }
}