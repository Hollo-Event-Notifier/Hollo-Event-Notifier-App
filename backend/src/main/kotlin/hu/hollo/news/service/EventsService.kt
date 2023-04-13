package hu.hollo.news.service

import hu.hollo.news.exception.BadRequestException
import hu.hollo.news.exception.NotFoundException
import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.repository.EventsRepository
import hu.hollo.news.service.adapter.EventsAdapter
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

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

    fun getEventById(id: UUID): EventDto =
        eventsAdapter.adaptDbToDto(
            eventsRepository.findByIdOrNull(id)
                ?: throw NotFoundException("Event does not exist with id=$id")
        )

    fun createEvent(eventDto: EventDto): EventDto {
        val dbEventToCreate = eventsAdapter.adaptDtoToDb(eventDto)

        if (dbEventToCreate.id != null) {
            throw BadRequestException("Events id should not be provided!")
        }

        return eventsAdapter.adaptDbToDto(eventsRepository.save(dbEventToCreate))
    }
}
