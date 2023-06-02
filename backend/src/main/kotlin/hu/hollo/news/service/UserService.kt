package hu.hollo.news.service

import hu.hollo.news.exception.BadCredentialsException
import hu.hollo.news.exception.BadRequestException
import hu.hollo.news.exception.ForbiddenException
import hu.hollo.news.exception.NotFoundException
import hu.hollo.news.model.AuthenticatedUser
import hu.hollo.news.model.db.Role
import hu.hollo.news.model.db.User
import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.repository.UserRepository
import hu.hollo.news.service.adapter.UserAdapter
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtClaimNames
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters.from
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit.HOURS
import java.util.*

@Service
class UserService(
    private val jwtEncoder: JwtEncoder,
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository,
    private val userAdapter: UserAdapter
) {
    fun loginUser(credentials: UserCredentialsDto): AuthenticatedUser {
        val foundUser = userRepository.findByUsername(credentials.username)
            ?: throw BadCredentialsException()
        if (!passwordEncoder.matches(credentials.password, foundUser.password)) {
            throw BadCredentialsException()
        }

        return AuthenticatedUser(
            userAdapter.adaptDbToDto(foundUser),
            generateToken(foundUser)
        )
    }

    fun getAllUsers(token: Jwt): List<UserDto> {
        if (getUserFromToken(token).role != Role.SystemAdmin) {
            throw ForbiddenException("User has no right to query this entity!")
        }

        return userRepository.findAll().map { user -> userAdapter.adaptDbToDto(user) }
    }

    fun getCurrentUser(token: Jwt): UserDto {
        val id = getUserIdFromToken(token)
        val dbUser = userRepository.findByIdOrNull(id)
            ?: throw BadRequestException("User does not exist with id=$id")
        return userAdapter.adaptDbToDto(dbUser)
    }

    fun updateUser(userToUpdate: UserDto, token: Jwt): UserDto {
        val userIdFromDto: UUID = userToUpdate.id ?: throw BadRequestException("User id is required!")
        val userFromToken = getUserFromToken(token)
        if (userFromToken.role != Role.SystemAdmin && userFromToken.id != userIdFromDto)
            throw ForbiddenException("User has no right to update this entity!")

        val dbUserToUpdate: User = userAdapter.adaptDtoToDb(userToUpdate)

        dbUserToUpdate.password = userRepository.findByIdOrNull(userIdFromDto)?.password
            ?: throw NotFoundException("User not found with id=$userIdFromDto")

        return userAdapter.adaptDbToDto(userRepository.save(dbUserToUpdate))
    }

    fun deleteUser(idToDelete: UUID, token: Jwt) {
        if (getUserFromToken(token).role != Role.SystemAdmin && getUserIdFromToken(token) != idToDelete)
            throw ForbiddenException("User has no right to delete this entity!")

        if (!userRepository.existsById(idToDelete))
            throw BadRequestException("User does not exist with id=$idToDelete")

        return userRepository.deleteById(idToDelete)
    }

    fun createUser(userToCreate: CreateUserRequestDto, token: Jwt): UserDto {
        if (getUserFromToken(token).role != Role.SystemAdmin)
            throw ForbiddenException("User has no right to create a new entity!")

        // validating new users fields
        if (userToCreate.id != null) {
            throw BadRequestException("User id can't be provided!")
        }

        if (!userToCreate.email.matches("""^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$""".toRegex())) {
            throw BadRequestException("Email format isn't valid!")
        }

        if (!userToCreate.password.matches("""^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}${'$'}""".toRegex())) {
            throw BadRequestException("User's password isn't complex enough!")
        }

        if(userRepository.existsByUsername(userToCreate.username)) {
            throw BadRequestException("Users with username '${userToCreate.username}' already exists!")
        }

        if(userRepository.existsByEmail(userToCreate.email)) {
            throw BadRequestException("Users with email '${userToCreate.email}' already exists!")
        }

        return userAdapter.adaptDbToDto(
            userRepository.save(
                User(
                    username = userToCreate.username,
                    email = userToCreate.email,
                    role = when (userToCreate.role) {
                        CreateUserRequestDto.Role.systemAdmin -> Role.SystemAdmin
                        CreateUserRequestDto.Role.eventAdmin -> Role.EventAdmin
                    },
                    password = passwordEncoder.encode(userToCreate.password)
                )
            )
        )
    }

    private fun generateToken(user: User): Jwt {
        val now = Instant.now()
        return jwtEncoder.encode(
            from(
                JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plus(1, HOURS))
                    .subject(user.id.toString())
                    .build()
            )
        )
    }

    private fun getUserIdFromToken(token: Jwt): UUID =
        UUID.fromString(token.claims[JwtClaimNames.SUB].toString())

    private fun getUserFromToken(token: Jwt): User {
        val id = getUserIdFromToken(token)
        return userRepository.findByIdOrNull(id)
            ?: throw BadRequestException("User not found with id=$id}")
    }

}
