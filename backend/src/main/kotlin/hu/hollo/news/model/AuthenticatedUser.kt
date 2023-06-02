package hu.hollo.news.model

import hu.hollo.news.model.dto.UserDto
import org.springframework.security.oauth2.jwt.Jwt

data class AuthenticatedUser(
    val user: UserDto,
    val token: Jwt
)