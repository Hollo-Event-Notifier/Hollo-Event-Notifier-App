package hu.hollo.news.model.dto

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import javax.validation.constraints.DecimalMax
import javax.validation.constraints.DecimalMin
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size
import javax.validation.Valid

/**
 * This DTO represents a the information needed to register a user
 * @param username 
 * @param email 
 * @param password 
 */
data class UserRegistrationDto(

    @get:JsonProperty("username", required = true) val username: kotlin.String,

    @get:Email
    @get:JsonProperty("email", required = true) val email: kotlin.String,

    @get:JsonProperty("password", required = true) val password: kotlin.String
) {

}

