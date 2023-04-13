package hu.hollo.news.service

import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.repository.EventsRepository
import hu.hollo.news.service.adapter.EventsAdapter
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class EventsService(
    private val eventsRepository: EventsRepository,
    private val eventsAdapter: EventsAdapter
) {
    fun getEventsBetween(startDate: LocalDateTime, endDate: LocalDateTime): List<EventDto> =
        // TODO: add start and end date checks and exceptions
        eventsRepository
            .findBetweenStartAndEnd(startDate, endDate)
            .map { event -> eventsAdapter.adaptDbToDto(event) }
}
