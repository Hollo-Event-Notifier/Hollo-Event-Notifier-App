package hu.hollo.news.service

import hu.hollo.news.exception.BadCredentialsException
import hu.hollo.news.exception.BadRequestException
import hu.hollo.news.exception.ForbiddenException
import hu.hollo.news.exception.NotFoundException
import hu.hollo.news.model.db.Role
import hu.hollo.news.model.db.User
import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.repository.UserRepository
import hu.hollo.news.service.adapter.RoleAdapter
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
    private val userAdapter: UserAdapter,
    private val roleAdapter: RoleAdapter
) {
    fun loginUser(credentials: UserCredentialsDto): Jwt {
        val foundUser = userRepository.findByUsername(credentials.username)
            ?: throw BadCredentialsException()
        if (!passwordEncoder.matches(credentials.password, foundUser.password)) {
            throw BadCredentialsException()
        }

        return generateToken(credentials.username)
    }

    fun getAllUsers(): List<UserDto> = userRepository.findAll().map { user -> userAdapter.adaptDbToDto(user) }

    fun updateUser(userToUpdate: UserDto, token: Jwt): UserDto {
        val userIdFromDto: UUID = userToUpdate.id ?: throw BadRequestException("User id is required!")
        val userIdFromToken = UUID.fromString(token.claims[JwtClaimNames.SUB].toString())
        if (userRepository.findByIdOrNull(userIdFromToken)?.role != Role.SystemAdmin &&
            userIdFromToken != userIdFromDto
        ) throw ForbiddenException("User has no right to update this entity!")

        val dbUserToUpdate: User = userAdapter.adaptDtoToDb(userToUpdate)


        dbUserToUpdate.password = userRepository.findByIdOrNull(userIdFromDto)?.password
            ?: throw NotFoundException("User not found with id=$userIdFromDto")

        return userAdapter.adaptDbToDto(userRepository.save(dbUserToUpdate))
    }

    fun deleteUser(idToDelete: UUID, token: Jwt) {
        val userIdFromToken = UUID.fromString(token.claims[JwtClaimNames.SUB].toString())
        if (userRepository.findByIdOrNull(userIdFromToken)?.role != Role.SystemAdmin &&
            userIdFromToken != idToDelete
        ) throw ForbiddenException("User has no right to delete this entity!")

        if (!userRepository.existsById(idToDelete))
            throw BadRequestException("User does not exist with id=$idToDelete")

        return userRepository.deleteById(idToDelete)
    }

    fun createUser(userToCreate: CreateUserRequestDto, token: Jwt): UserDto {
        val userIdFromToken = UUID.fromString(token.claims[JwtClaimNames.SUB].toString())
        if (userRepository.findByIdOrNull(userIdFromToken)?.role != Role.SystemAdmin)
            throw ForbiddenException("User has no right to create a new entity!")


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

    private fun generateToken(username: String): Jwt {
        val now = Instant.now()
        val user = userRepository.findByUsername(username)
            ?: throw NotFoundException("User does not exist with username=$username")
        return jwtEncoder.encode(
            from(
                JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plus(1, HOURS))
                    .subject(username)
                    .claim(JwtClaimNames.SUB, user.id)
                    .build()
            )
        )
    }
}
