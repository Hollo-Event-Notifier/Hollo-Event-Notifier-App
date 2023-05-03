package hu.hollo.news.service

import hu.hollo.news.exception.BadRequestException
import hu.hollo.news.exception.EventNotFoundException
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
                ?: throw EventNotFoundException(id)
        )

    fun createEvent(eventDto: EventDto): EventDto {
        val dbEventToCreate = eventsAdapter.adaptDtoToDb(eventDto)

        if (dbEventToCreate.id != null) {
            throw BadRequestException("Events id should not be provided!")
        }

        return eventsAdapter.adaptDbToDto(eventsRepository.save(dbEventToCreate))
    }

    fun updateEvent(id: UUID, eventDto: EventDto): EventDto {
        if (!eventsRepository.existsById(id)) {
            throw EventNotFoundException(id)
        }

        val eventInDb = eventsRepository.findByIdOrNull(id)!!

        eventInDb.title = eventDto.title
        eventInDb.place = eventDto.place
        eventInDb.organizer = eventDto.organizer
        eventInDb.hasPoints = eventDto.hasPoints
        eventInDb.startDate = eventDto.startDate.toLocalDateTime()
        eventInDb.endDate = eventDto.endDate.toLocalDateTime()
        eventInDb.link = eventDto.link?.toURL()

        return eventsAdapter.adaptDbToDto(eventsRepository.save(eventInDb))
    }
    fun deleteEvent(id: UUID) {
        if(!eventsRepository.existsById(id)) {
            throw EventNotFoundException(id)
        }

        eventsRepository.deleteById(id)
    }
}
