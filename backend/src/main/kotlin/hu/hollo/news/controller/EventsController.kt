package hu.hollo.news.controller

import hu.hollo.news.api.EventsApi
import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.service.EventsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.time.OffsetDateTime

@RestController
class EventsController(private val eventsService: EventsService) : EventsApi {
    override fun getEvents(startDate: OffsetDateTime, endDate: OffsetDateTime): ResponseEntity<List<EventDto>> =
        ResponseEntity
            .ok()
            .body(eventsService.getEventsBetween(startDate.toLocalDateTime(), endDate.toLocalDateTime()))
}