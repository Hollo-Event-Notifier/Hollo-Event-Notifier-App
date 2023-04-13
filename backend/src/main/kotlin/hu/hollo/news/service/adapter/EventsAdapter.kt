package hu.hollo.news.service.adapter

import hu.hollo.news.model.db.Event
import hu.hollo.news.model.dto.EventDto
import org.springframework.stereotype.Service
import java.time.ZoneOffset

@Service
class EventsAdapter : Adapter<EventDto, Event> {
    override fun adaptDtoToDb(dto: EventDto): Event = Event(
        title = dto.title,
        place = dto.place,
        organizer = dto.organizer,
        hasPoints = dto.hasPoints,
        startDate = dto.startDate.toLocalDateTime(),
        endDate = dto.endDate.toLocalDateTime(),
        link = dto.link?.toURL(),
        id = dto.id
    )

    override fun adaptDbToDto(db: Event): EventDto = EventDto(
        title = db.title,
        place = db.place,
        organizer = db.organizer,
        hasPoints = db.hasPoints,
        startDate = db.startDate.atOffset(ZoneOffset.UTC),
        endDate = db.endDate.atOffset(ZoneOffset.UTC),
        link = db.link?.toURI(),
        id = db.id
    )

}
