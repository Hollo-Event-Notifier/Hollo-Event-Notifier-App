package hu.hollo.news.exception

import java.util.*

class EventNotFoundException(id: UUID) : NotFoundException("Event does not exist with id=$id")