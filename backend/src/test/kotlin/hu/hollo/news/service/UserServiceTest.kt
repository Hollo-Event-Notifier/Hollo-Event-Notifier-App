package hu.hollo.news.service

import hu.hollo.news.exception.*
import hu.hollo.news.model.db.Role
import hu.hollo.news.model.db.User
import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.repository.UserRepository
import hu.hollo.news.service.adapter.UserAdapter
import io.mockk.*
import org.junit.jupiter.api.*
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtClaimNames
import org.springframework.security.oauth2.jwt.JwtEncoder
import java.time.Instant
import java.util.*

class UserServiceTest {
    private lateinit var jwtEncoder: JwtEncoder
    private lateinit var passwordEncoder: PasswordEncoder
    private lateinit var userRepository: UserRepository
    private lateinit var userAdapter: UserAdapter
    private lateinit var userService: UserService

    @BeforeEach
    fun setup() {
        jwtEncoder = mockk()
        passwordEncoder = mockk()
        userRepository = mockk()
        userAdapter = mockk()
        userService = UserService(jwtEncoder, passwordEncoder, userRepository, userAdapter)
    }

    @Nested
    @DisplayName("loginUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class LoginUserTest {
        @Test
        fun `should return authenticated user when valid credentials are provided`() {
            // Arrange
            val credentials = UserCredentialsDto(username = "test username", password = "password")
            val foundUser = User(
                username = credentials.username,
                email = "test@test.com",
                role = Role.SystemAdmin,
            )

            every { userRepository.findByUsername(credentials.username) } returns foundUser
            every { passwordEncoder.matches(credentials.password, foundUser.password) } returns true
            every { userAdapter.adaptDbToDto(foundUser) } returns mockk()
            every { jwtEncoder.encode(any()) } returns mockk()

            // Act
            val result = userService.loginUser(credentials)

            // Assert
            Assertions.assertNotNull(result)

            // Verify
            verify(exactly = 1) { userRepository.findByUsername(credentials.username) }
            verify(exactly = 1) { passwordEncoder.matches(credentials.password, foundUser.password) }
            verify(exactly = 1) { userAdapter.adaptDbToDto(foundUser) }
            verify(exactly = 1) { jwtEncoder.encode(any()) }
        }

        @Test
        fun `should throw BadCredentialsException when invalid credentials are provided`() {
            // Arrange
            val credentials = UserCredentialsDto(username = "test username", password = "test password")
            val foundUser = User(
                username = credentials.username,
                email = "test@test.com",
                role = Role.SystemAdmin,
            )


            every { userRepository.findByUsername(credentials.username) } returns foundUser
            every { passwordEncoder.matches(credentials.password, foundUser.password) } returns false

            // Act & Assert
            Assertions.assertThrows(BadCredentialsException::class.java) {
                userService.loginUser(credentials)
            }

            // Verify
            verify(exactly = 1) { userRepository.findByUsername(credentials.username) }
            verify(exactly = 1) { passwordEncoder.matches(credentials.password, foundUser.password) }
            verify(exactly = 0) { userAdapter.adaptDbToDto(any()) }
            verify(exactly = 0) { jwtEncoder.encode(any()) }
        }
    }

    @Nested
    @DisplayName("getAllUsers")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetAllUsersTest {
        @Test
        fun `should return all users when user has SystemAdmin role`() {
            // Arrange
            val user = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = UUID.randomUUID()
            )
            val userList = listOf(user)
            val userDto = UserDto(
                username = user.username,
                email = user.email,
                role = UserDto.Role.systemAdmin,
                id = user.id
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, user.id))
            )


            every { userRepository.findById(user.id!!) } returns Optional.of(user)
            every { userRepository.findAll() } returns userList
            every { userAdapter.adaptDbToDto(user) } returns userDto

            // Act
            val result = userService.getAllUsers(token)

            // Assert
            Assertions.assertEquals(1, result.size)

            // Verify
            verify(exactly = 1) { userRepository.findById(user.id!!) }
            verify(exactly = 1) { userRepository.findAll() }
            verify(exactly = 1) { userAdapter.adaptDbToDto(user) }
        }

        @Test
        fun `should throw ForbiddenException when user does not have SystemAdmin role`() {
            // Arrange
            val user = User(
                username = "test username",
                email = "test@test.com",
                role = Role.EventAdmin,
                id = UUID.randomUUID()
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, user.id))
            )

            every { userRepository.findById(user.id!!) } returns Optional.of(user)

            // Act & Assert
            Assertions.assertThrows(ForbiddenException::class.java) {
                userService.getAllUsers(token)
            }

            // Verify
            verify(exactly = 1) { userRepository.findById(user.id!!) }
            verify(exactly = 0) { userRepository.findAll() }
            verify(exactly = 0) { userAdapter.adaptDbToDto(any()) }
        }
    }

    @Nested
    @DisplayName("getCurrentUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetCurrentUserTest {
        @Test
        fun `should return current user when user exists with the specified id`() {
            // Arrange
            val userId = UUID.randomUUID()
            val dbUser = User(
                username = "test username",
                email = "test@test.com",
                role = Role.EventAdmin,
                id = userId
            )
            val userDto = UserDto(
                username = dbUser.username,
                email = dbUser.email,
                role = UserDto.Role.eventAdmin
            )
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, dbUser.id))
            )

            every { userRepository.findById(userId) } returns Optional.of(dbUser)
            every { userAdapter.adaptDbToDto(dbUser) } returns userDto

            // Act
            val result = userService.getCurrentUser(token)

            // Assert
            Assertions.assertEquals(userDto, result)

            // Verify
            verify(exactly = 1) { userRepository.findById(userId) }
            verify(exactly = 1) { userAdapter.adaptDbToDto(dbUser) }
        }

        @Test
        fun `should throw BadRequestException when user does not exist with the specified id`() {
            // Arrange
            val userId = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userId))
            )

            every { userRepository.findById(userId) } returns Optional.empty()

            // Act & Assert
            Assertions.assertThrows(BadRequestException::class.java) {
                userService.getCurrentUser(token)
            }

            // Verify
            verify(exactly = 1) { userRepository.findById(userId) }
            verify(exactly = 0) { userAdapter.adaptDbToDto(any()) }
        }
    }

    //
    @Nested
    @DisplayName("updateUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class UpdateUserTest {
        @Test
        fun `should update the user with the specified id when user has SystemAdmin role`() {
            // Arrange
            val userId = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userId))
            )
            val dbUserToUpdate = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userId
            )
            val userToUpdate = UserDto(
                username = dbUserToUpdate.username,
                email = dbUserToUpdate.email,
                role = UserDto.Role.systemAdmin,
                id = dbUserToUpdate.id
            )

            every { userRepository.findByIdOrNull(userId) } returns dbUserToUpdate
            every { userAdapter.adaptDtoToDb(userToUpdate) } returns dbUserToUpdate
            every { userRepository.save(dbUserToUpdate) } returns dbUserToUpdate
            every { userAdapter.adaptDbToDto(dbUserToUpdate) } returns userToUpdate

            // Act
            val result = userService.updateUser(userToUpdate, token)

            // Assert
            Assertions.assertEquals(userToUpdate, result)

            // Verify
            verify(exactly = 2) { userRepository.findByIdOrNull(userId) }
            verify(exactly = 1) { userAdapter.adaptDtoToDb(userToUpdate) }
            verify(exactly = 1) { userRepository.save(dbUserToUpdate) }
            verify(exactly = 1) { userAdapter.adaptDbToDto(dbUserToUpdate) }
        }

        @Test
        fun `should update the user with the specified id when user is the owner of the user entity`() {
            // Arrange
            val userId = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userId))
            )
            val dbUserToUpdate = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userId
            )
            val userToUpdate = UserDto(
                username = dbUserToUpdate.username,
                email = dbUserToUpdate.email,
                role = UserDto.Role.systemAdmin,
                id = dbUserToUpdate.id
            )

            every { userRepository.findByIdOrNull(userId) } returns dbUserToUpdate
            every { userAdapter.adaptDtoToDb(userToUpdate) } returns dbUserToUpdate
            every { userRepository.save(dbUserToUpdate) } returns dbUserToUpdate
            every { userAdapter.adaptDbToDto(dbUserToUpdate) } returns userToUpdate

            // Act
            val result = userService.updateUser(userToUpdate, token)

            // Assert
            Assertions.assertEquals(userToUpdate, result)

            // Verify
            verify(exactly = 2) { userRepository.findByIdOrNull(userId) }
            verify(exactly = 1) { userAdapter.adaptDtoToDb(userToUpdate) }
            verify(exactly = 1) { userRepository.save(dbUserToUpdate) }
            verify(exactly = 1) { userAdapter.adaptDbToDto(dbUserToUpdate) }
        }

        @Test
        fun `should throw ForbiddenException when user does not have SystemAdmin role and is not the owner of the user entity`() {
            // Arrange
            val userIdFromDto = UUID.randomUUID()
            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.EventAdmin,
                id = userIdFromToken
            )
            val userToUpdate = UserDto(
                username = "test username 2",
                email = "test email 2",
                role = UserDto.Role.systemAdmin,
                id = userIdFromDto
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            Assertions.assertThrows(ForbiddenException::class.java) {
                userService.updateUser(userToUpdate, token)
            }

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromToken) }
            verify(exactly = 0) { userAdapter.adaptDtoToDb(any()) }
            verify(exactly = 0) { userRepository.save(any()) }
            verify(exactly = 0) { userAdapter.adaptDbToDto(any()) }
        }

        @Test
        fun `should throw NotFoundException when user does to update does not exist in db`() {
            // Arrange
            val userIdFromDto = UUID.randomUUID()
            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )
            val userToUpdate = UserDto(
                username = "test username 2",
                email = "test email 2",
                role = UserDto.Role.systemAdmin,
                id = userIdFromDto
            )
            val dbUserToUpdate = User(
                username = userToUpdate.username,
                email = userToUpdate.email,
                role = Role.SystemAdmin,
                id = userIdFromDto
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken
            every { userRepository.findByIdOrNull(userIdFromDto) } returns null
            every { userAdapter.adaptDtoToDb(userToUpdate) } returns dbUserToUpdate

            // Act
            val got = Assertions.assertThrows(NotFoundException::class.java) {
                userService.updateUser(userToUpdate, token)
            }

            // Assert
            Assertions.assertEquals("User not found with id=$userIdFromDto", got.message)

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromToken) }
            verify(exactly = 1) { userAdapter.adaptDtoToDb(userToUpdate) }
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromDto) }
            verify(exactly = 0) { userRepository.save(any()) }
            verify(exactly = 0) { userAdapter.adaptDbToDto(any()) }
        }
    }

    @Nested
    @DisplayName("deleteUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class DeleteUserTest {
        @Test
        fun `should delete the user with the specified id when user has SystemAdmin role`() {
            // Arrange
            val userIdFromToken = UUID.randomUUID()
            val userIdToDelete = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken
            every { userRepository.deleteById(userIdToDelete) } just runs
            every { userRepository.existsById(userIdToDelete) } returns true

            // Act
            userService.deleteUser(userIdToDelete, token)

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromToken) }
            verify(exactly = 1) { userRepository.existsById(userIdToDelete) }
            verify(exactly = 1) { userRepository.deleteById(userIdToDelete) }
        }

        @Test
        fun `should delete the user with the specified id when user is the owner of the user entity`() {
            // Arrange
            val userIdToDelete = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdToDelete))
            )
            val dbUser = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdToDelete
            )

            every { userRepository.findByIdOrNull(userIdToDelete) } returns dbUser
            every { userRepository.existsById(userIdToDelete) } returns true
            every { userRepository.deleteById(userIdToDelete) } just runs

            // Act
            userService.deleteUser(userIdToDelete, token)

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdToDelete) }
            verify(exactly = 1) { userRepository.existsById(userIdToDelete) }
            verify(exactly = 1) { userRepository.deleteById(userIdToDelete) }
        }

        @Test
        fun `should throw ForbiddenException when user does not have SystemAdmin role and is not the owner of the user entity`() {
            // Arrange
            val userIdFromToken = UUID.randomUUID()
            val userIdToDelete = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.EventAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            val got = Assertions.assertThrows(ForbiddenException::class.java) {
                userService.deleteUser(userIdToDelete, token)
            }
            Assertions.assertEquals("User has no right to delete this entity!", got.message)

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromToken) }
            verify(exactly = 0) { userRepository.existsById(any()) }
            verify(exactly = 0) { userRepository.deleteById(any()) }
        }

        @Test
        fun `should throw BadRequestException when user to delete does not exist in database`() {
            // Arrange
            val userIdFromToken = UUID.randomUUID()
            val userIdToDelete = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken
            every { userRepository.existsById(userIdToDelete) } returns false

            // Act & Assert
            val got = Assertions.assertThrows(BadRequestException::class.java) {
                userService.deleteUser(userIdToDelete, token)
            }
            Assertions.assertEquals("User does not exist with id=$userIdToDelete", got.message)

            // Verify
            verify(exactly = 1) { userRepository.findByIdOrNull(userIdFromToken) }
            verify(exactly = 1) { userRepository.existsById(userIdToDelete) }
            verify(exactly = 0) { userRepository.deleteById(any()) }
        }
    }

    @Nested
    @DisplayName("createUser")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class CreateUserTest {
        @Test
        fun `should throw ForbiddenException when user is not System Admin`() {
            // Arrange
            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.EventAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            val exception = Assertions.assertThrows(ForbiddenException::class.java) {
                userService.createUser(mockk(), token)
            }
            Assertions.assertEquals("User has no right to create a new entity!", exception.message)
        }

        @Test
        fun `should throw BadRequestException when user id is provided`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                id = UUID.randomUUID(),
                username = "testuser",
                email = "testuser@example.com",
                password = "Password123",
                role = CreateUserRequestDto.Role.systemAdmin
            )
            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            val exception = Assertions.assertThrows(BadRequestException::class.java) {
                userService.createUser(userToCreate, token)
            }
            Assertions.assertEquals("User id can't be provided!", exception.message)
        }

        @Test
        fun `should throw BadRequestException when email format is invalid`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                username = "testuser",
                email = "invalidEmail",
                password = "Password123",
                role = CreateUserRequestDto.Role.systemAdmin
            )

            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            val exception = Assertions.assertThrows(BadRequestException::class.java) {
                userService.createUser(userToCreate, token)
            }
            Assertions.assertEquals("Email format isn't valid!", exception.message)
        }

        @Test
        fun `createUser should throw BadRequestException when password is not complex enough`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                username = "testuser",
                email = "testuser@example.com",
                password = "password", // Not complex enough
                role = CreateUserRequestDto.Role.systemAdmin
            )

            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken

            // Act & Assert
            val exception = Assertions.assertThrows(BadRequestException::class.java) {
                userService.createUser(userToCreate, token)
            }
            Assertions.assertEquals("User's password isn't complex enough!", exception.message)
        }

        @Test
        fun `createUser should throw BadRequestException when username already exists`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                username = "existinguser",
                email = "testuser@example.com",
                password = "Password123",
                role = CreateUserRequestDto.Role.systemAdmin
            )

            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken
            every { userRepository.existsByUsername(userToCreate.username) } returns true

            // Act & Assert
            val exception = Assertions.assertThrows(BadRequestException::class.java) {
                userService.createUser(userToCreate, token)
            }
            Assertions.assertEquals("Users with username 'existinguser' already exists!", exception.message)

            // Verify
            verify { userRepository.findByIdOrNull(userIdFromToken) }
            verify { userRepository.existsByUsername(userToCreate.username) }
            confirmVerified(userRepository)
        }

        @Test
        fun `createUser should throw BadRequestException when email already exists`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                username = "testuser",
                email = "existinguser@example.com",
                password = "Password123",
                role = CreateUserRequestDto.Role.systemAdmin
            )

            val userIdFromToken = UUID.randomUUID()
            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, userIdFromToken))
            )
            val dbUserFromToken = User(
                username = "test username",
                email = "test@test.com",
                role = Role.SystemAdmin,
                id = userIdFromToken
            )

            every { userRepository.findByIdOrNull(userIdFromToken) } returns dbUserFromToken
            every { userRepository.existsByUsername(userToCreate.username) } returns false
            every { userRepository.existsByEmail(userToCreate.email) } returns true

            // Act & Assert
            val exception = Assertions.assertThrows(BadRequestException::class.java) {
                userService.createUser(userToCreate, token)
            }
            Assertions.assertEquals("Users with email 'existinguser@example.com' already exists!", exception.message)

            verify { userRepository.findByIdOrNull(userIdFromToken) }
            verify { userRepository.existsByUsername(userToCreate.username) }
            verify { userRepository.existsByEmail(userToCreate.email) }
            confirmVerified(userRepository)
        }

        @Test
        fun `createUser should save and return the created user when all inputs are valid`() {
            // Arrange
            val userToCreate = CreateUserRequestDto(
                username = "testuser",
                email = "testuser@example.com",
                password = "Password123",
                role = CreateUserRequestDto.Role.systemAdmin
            )

            val token = Jwt(
                "token",
                Instant.now(),
                Instant.now().plusSeconds(10),
                mapOf(Pair("key1", "value1")),
                mapOf(Pair(JwtClaimNames.SUB, UUID.randomUUID()))
            )

            val savedUser = User(
                username = userToCreate.username,
                email = userToCreate.email,
                role = Role.SystemAdmin,
                password = "hashedPassword"
            )
            val savedUserDto = UserDto(
                username = savedUser.username,
                email = savedUser.email,
                role = UserDto.Role.systemAdmin
            )

            every { userRepository.findByIdOrNull(any()) } returns User(
                username = "admin",
                email = "admin@example.com",
                role = Role.SystemAdmin,
                password = "hashedPassword"
            )
            every { userRepository.save(any()) } returns savedUser
            every { userRepository.existsByUsername(userToCreate.username) } returns false
            every { userRepository.existsByEmail(userToCreate.email) } returns false
            every { userAdapter.adaptDbToDto(savedUser) } returns savedUserDto
            every { passwordEncoder.encode(userToCreate.password) } returns "hashedPassword"

            // Act
            val createdUser = userService.createUser(userToCreate, token)

            // Assert
            Assertions.assertEquals(userToCreate.username, createdUser.username)
            Assertions.assertEquals(userToCreate.email, createdUser.email)
            Assertions.assertEquals(UserDto.Role.systemAdmin, createdUser.role)

            // Verify
            verify { userRepository.findByIdOrNull(any()) }
            verify { userRepository.existsByUsername(userToCreate.username) }
            verify { userRepository.existsByEmail(userToCreate.email) }
            verify { userRepository.save(any()) }
            verify { passwordEncoder.encode(userToCreate.password) }
            confirmVerified(userRepository, passwordEncoder)
        }
    }
}
