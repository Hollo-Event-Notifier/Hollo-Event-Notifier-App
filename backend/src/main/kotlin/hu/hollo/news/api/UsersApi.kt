/**
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech) (6.5.0-SNAPSHOT).
 * https://openapi-generator.tech
 * Do not edit the class manually.
*/
package hu.hollo.news.api

import hu.hollo.news.model.dto.CreateUserRequestDto
import hu.hollo.news.model.dto.ErrorDto
import hu.hollo.news.model.dto.UserCredentialsDto
import hu.hollo.news.model.dto.UserDto
import hu.hollo.news.model.dto.UserRegistrationDto
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity

import org.springframework.web.bind.annotation.*
import org.springframework.validation.annotation.Validated
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.beans.factory.annotation.Autowired

import javax.validation.constraints.DecimalMax
import javax.validation.constraints.DecimalMin
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotNull
import javax.validation.constraints.Pattern
import javax.validation.constraints.Size
import javax.validation.Valid

import kotlin.collections.List
import kotlin.collections.Map

@Validated
@RequestMapping("\${api.base-path:}")
interface UsersApi {


    @RequestMapping(
            method = [RequestMethod.GET],
            value = ["/users/check-token"],
            produces = ["application/json"]
    )
    fun checkToken(): ResponseEntity<UserDto> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.PUT],
            value = ["/users"],
            produces = ["application/json"],
            consumes = ["application/json"]
    )
    fun createUser( @Valid @RequestBody createUserRequestDto: CreateUserRequestDto): ResponseEntity<UserDto> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.DELETE],
            value = ["/users/{id}"],
            produces = ["application/json"]
    )
    fun deleteUserById( @PathVariable("id") id: java.util.UUID): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.GET],
            value = ["/users"],
            produces = ["application/json"]
    )
    fun getAllUsers(): ResponseEntity<List<UserDto>> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.POST],
            value = ["/users/login"],
            produces = ["application/json"],
            consumes = ["application/json"]
    )
    fun login( @Valid @RequestBody userCredentialsDto: UserCredentialsDto): ResponseEntity<UserDto> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.POST],
            value = ["/users/register"],
            produces = ["application/json"],
            consumes = ["application/json"]
    )
    fun registerUser( @Valid @RequestBody userRegistrationDto: UserRegistrationDto): ResponseEntity<Unit> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }


    @RequestMapping(
            method = [RequestMethod.POST],
            value = ["/users"],
            produces = ["application/json"],
            consumes = ["application/json"]
    )
    fun updateUser( @Valid @RequestBody userDto: UserDto): ResponseEntity<UserDto> {
        return ResponseEntity(HttpStatus.NOT_IMPLEMENTED)
    }
}
