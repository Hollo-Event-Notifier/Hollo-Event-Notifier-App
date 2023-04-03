package hu.hollo.news.model.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * These should be provided to obtain JWT token
 * @param username 
 * @param password 
 */
data class UserCredentialsDto(

    @get:JsonProperty("username", required = true) val username: kotlin.String,

    @get:JsonProperty("password", required = true) val password: kotlin.String
) {

}

