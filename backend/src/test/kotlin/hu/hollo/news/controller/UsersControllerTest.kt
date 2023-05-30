
import hu.hollo.news.controller.UsersController
import hu.hollo.news.model.AuthenticatedUser
import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.service.UserService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.assertEquals
import org.springframework.boot.web.server.Cookie
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import java.time.Instant
import java.util.*
import kotlin.time.Duration.Companion.hours
import kotlin.time.toJavaDuration

@DisplayName("UsersController")
class UsersControllerTest {
    private lateinit var userService: UserService
    private lateinit var usersController: UsersController
    private val cookieName = "auth_cookie"

    @BeforeEach
    fun setup() {
        userService = mockk()
        usersController = UsersController(userService, cookieName)
    }

    @Nested
    @DisplayName("login")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class Login {
        @Test
        @DisplayName("Should return user and set cookie")
        fun `should return user and set cookie`() {
            // Arrange
            val userCredentialsDto = UserCredentialsDto("username", "password")
            val currentUserDto = UserDto(
                username = "username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            every { userService.loginUser(userCredentialsDto) } returns AuthenticatedUser(currentUserDto, token)

            // Act
            val responseEntity = usersController.login(userCredentialsDto)

            // Assert
            assertEquals(
                ResponseEntity
                    .ok()
                    .headers {
                        it.set(
                            HttpHeaders.SET_COOKIE,
                            ResponseCookie // TODO: add all necessary security restrictions
                                .from(cookieName, token.tokenValue)
                                .httpOnly(false) // TODO: should be addressed later
                                .secure(false) // TODO: add when HTTPS setup
                                .sameSite(Cookie.SameSite.STRICT.attributeValue())
                                .path("/")
                                .maxAge(1.hours.toJavaDuration())
                                .build().toString()
                        )
                    }
                    .body(currentUserDto),
                responseEntity
            )
        }
    }

    @Nested
    @DisplayName("checkToken")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class CheckToken {
        @Test
        @DisplayName("Should return current user")
        fun `should return current user`() {
            // Arrange
            val currentUserDto = UserDto(
                username = "username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            every { userService.getCurrentUser(token) } returns currentUserDto
            mockAuthentication(token)

            // Act
            val responseEntity = usersController.checkToken()

            // Assert
            assertEquals(HttpStatus.OK, responseEntity.statusCode)
            assertEquals(currentUserDto, responseEntity.body)
        }
    }

    @Nested
    @DisplayName("getAllUsers")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetAllUsers {
        @Test
        @DisplayName("Should return all users")
        fun `should return all users`() {
            // Arrange
            val currentUserDto = UserDto(
                username = "username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            every { userService.getAllUsers(token) } returns listOf(currentUserDto)
            mockAuthentication(token)

            // Act
            val responseEntity = usersController.getAllUsers()

            // Assert
            assertEquals(HttpStatus.OK, responseEntity.statusCode)
            assertEquals(listOf(currentUserDto), responseEntity.body)
        }
    }

    @Nested
    @DisplayName("updateUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class UpdateUser {
        @Test
        @DisplayName("Should update user and return updated user")
        fun `should update user and return updated user`() {
            // Arrange
            val userDto = UserDto(
                username = "username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val updatedUserDto = UserDto(
                username = "updated_username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            every { userService.updateUser(userDto, token) } returns updatedUserDto
            mockAuthentication(token)

            // Act
            val responseEntity = usersController.updateUser(userDto)

            // Assert
            assertEquals(HttpStatus.OK, responseEntity.statusCode)
            assertEquals(updatedUserDto, responseEntity.body)
        }
    }

    @Nested
    @DisplayName("createUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class CreateUser {
        @Test
        @DisplayName("Should create a new user")
        fun `should create a new user`() {
            // Arrange
            val createUserRequestDto = CreateUserRequestDto(
                username = "username",
                email = "user@user.com",
                role = CreateUserRequestDto.Role.eventAdmin,
                password = "password"
            )
            val createdUserDto = UserDto(
                username = "username",
                email = "username@test.com",
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            mockAuthentication(token)
            every { userService.createUser(createUserRequestDto, token) } returns createdUserDto

            // Act
            val responseEntity = usersController.createUser(createUserRequestDto)

            // Assert
            assertEquals(HttpStatus.OK, responseEntity.statusCode)
            assertEquals(createdUserDto, responseEntity.body)
        }
    }

    @Nested
    @DisplayName("deleteUserById")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class DeleteUserById {
        @Test
        @DisplayName("Should delete user and return no content")
        fun `should delete user and return no content`() {
            // Arrange
            val userId = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair("key1", "value1"))
            )

            mockAuthentication(token)
            every { userService.deleteUser(userId, token) } returns Unit

            // Act
            val responseEntity = usersController.deleteUserById(userId)

            // Assert
            assertEquals(HttpStatus.NO_CONTENT, responseEntity.statusCode)
            assertEquals(null, responseEntity.body)
        }
    }

    private fun mockAuthentication(token: Jwt) {
        val authentication: Authentication = mockk()
        every { authentication.principal } returns token
        SecurityContextHolder.getContext().authentication = authentication
    }
}
