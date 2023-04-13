package hu.hollo.news.controller

import hu.hollo.news.api.EventsApi
import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.service.EventsService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RestController
import java.time.OffsetDateTime
import java.util.*

@RestController
class EventsController(private val eventsService: EventsService) : EventsApi {
    override fun getEvents(startDate: OffsetDateTime, endDate: OffsetDateTime): ResponseEntity<List<EventDto>> =
        ResponseEntity
            .ok()
            .body(eventsService.getEventsBetween(startDate.toLocalDateTime(), endDate.toLocalDateTime()))

    override fun getEventById(id: UUID): ResponseEntity<EventDto> =
        ResponseEntity
            .ok()
            .body(eventsService.getEventById(id))

    override fun createEvent(eventDto: EventDto): ResponseEntity<EventDto> =
        ResponseEntity(eventsService.createEvent(eventDto), HttpStatus.CREATED)

    override fun updateEventById(id: UUID, eventDto: EventDto): ResponseEntity<EventDto> =
        ResponseEntity
            .ok()
            .body(eventsService.updateEvent(id, eventDto))

    override fun deleteEventById(id: UUID): ResponseEntity<Unit> {
        eventsService.deleteEvent(id)
        return ResponseEntity.noContent().build()
    }
}