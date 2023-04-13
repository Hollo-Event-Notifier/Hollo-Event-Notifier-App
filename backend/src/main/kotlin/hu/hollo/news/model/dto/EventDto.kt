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
 * This DTO represents an event in the dormitory
 * @param title 
 * @param place 
 * @param organizer 
 * @param hasPoints 
 * @param startDate 
 * @param endDate 
 * @param link 
 * @param id 
 */
data class EventDto(

    @get:JsonProperty("title", required = true) val title: kotlin.String,

    @get:JsonProperty("place", required = true) val place: kotlin.String,

    @get:JsonProperty("organizer", required = true) val organizer: kotlin.String,

    @get:JsonProperty("hasPoints", required = true) val hasPoints: kotlin.Boolean,

    @get:JsonProperty("startDate", required = true) val startDate: java.time.OffsetDateTime,

    @get:JsonProperty("endDate", required = true) val endDate: java.time.OffsetDateTime,

    @field:Valid
    @get:JsonProperty("link") val link: java.net.URI? = null,

    @get:JsonProperty("id") val id: java.util.UUID? = null
) {

}

