package hu.hollo.news.service.adapter

import hu.hollo.news.model.db.Event
import hu.hollo.news.model.dto.EventDto
import org.springframework.stereotype.Service

@Service
class EventTypeAdapter : Adapter<EventDto.Type, Event.Type> {
    override fun adaptDtoToDb(dto: EventDto.Type): Event.Type  = when(dto) {
        EventDto.Type.professional -> Event.Type.Professional
        EventDto.Type.community -> Event.Type.Community
        EventDto.Type.other -> Event.Type.Other
    }

    override fun adaptDbToDto(db: Event.Type): EventDto.Type = when(db) {
        Event.Type.Community -> EventDto.Type.community
        Event.Type.Professional -> EventDto.Type.professional
        Event.Type.Other -> EventDto.Type.other
    }
}