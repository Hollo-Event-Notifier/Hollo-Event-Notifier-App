package hu.hollo.news.model.dto

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * 
 * @param password 
 */
data class CreateUserRequestAllOfDto(

    @get:JsonProperty("password", required = true) val password: kotlin.String
) {

}

