package hu.hollo.news.service

import hu.hollo.news.exception.BadCredentialsException
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtClaimsSet
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.JwtEncoderParameters.from
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit.HOURS


@Service
class UserService(
    private val jwtEncoder: JwtEncoder,
    private val passwordEncoder: PasswordEncoder,
    private val userRepository: UserRepository
) {
    fun loginUser(credentials: UserCredentialsDto): Jwt {
        val foundUser = userRepository.findByUsername(credentials.username)
            ?: throw BadCredentialsException()
        if (!passwordEncoder.matches(credentials.password, foundUser.password)) {
            throw BadCredentialsException()
        }


        return generateToken(credentials.username)
    }

    private fun generateToken(username: String): Jwt {
        val now = Instant.now()
        return jwtEncoder.encode(
            from(
                JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plus(1, HOURS))
                    .subject(username)
                    .claim("scope", "")
                    .build()
            )
        )
    }
}
