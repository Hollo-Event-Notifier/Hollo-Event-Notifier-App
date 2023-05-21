package hu.hollo.news.model.dto

import java.util.Objects
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonValue
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
 * 
 * @param username 
 * @param email 
 * @param role 
 * @param password 
 * @param id 
 */
data class CreateUserRequestDto(

    @get:JsonProperty("username", required = true) val username: kotlin.String,

    @get:Email
    @get:JsonProperty("email", required = true) val email: kotlin.String,

    @get:JsonProperty("role", required = true) val role: CreateUserRequestDto.Role,

    @get:JsonProperty("password", required = true) val password: kotlin.String,

    @get:JsonProperty("id") val id: java.util.UUID? = null
) {

    /**
    * 
    * Values: systemAdmin,eventAdmin
    */
    enum class Role(val value: kotlin.String) {

        @JsonProperty("SystemAdmin") systemAdmin("SystemAdmin"),
        @JsonProperty("EventAdmin") eventAdmin("EventAdmin")
    }

}

