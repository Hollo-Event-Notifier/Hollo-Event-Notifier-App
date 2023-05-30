package hu.hollo.news.service

import hu.hollo.news.exception.BadRequestException
import hu.hollo.news.exception.EventNotFoundException
import hu.hollo.news.model.db.Event
import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.repository.EventsRepository
import hu.hollo.news.service.adapter.EventsAdapter
import io.mockk.*
import org.junit.jupiter.api.*
import org.springframework.data.repository.findByIdOrNull
import java.net.URI
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.util.*

class EventsServiceTest {
    private lateinit var eventsRepository: EventsRepository
    private lateinit var eventsAdapter: EventsAdapter
    private lateinit var eventsService: EventsService

    @BeforeEach
    fun setup() {
        eventsRepository = mockk()
        eventsAdapter = mockk()
        eventsService = EventsService(eventsRepository, eventsAdapter)
    }

    @Nested
    @DisplayName("getEventsBetween")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetEventsBetweenTest {
        @Test
        fun `should return events between start and end date`() {
            // Arrange
            val startDate = LocalDateTime.parse("2023-01-01T00:00:00")
            val endDate = LocalDateTime.parse("2023-01-31T23:59:59")
            val dbEvent1 = mockk<Event>()
            val dbEvent2 = mockk<Event>()
            val eventDto1 = mockk<EventDto>()
            val eventDto2 = mockk<EventDto>()

            every { eventsRepository.findBetweenStartAndEnd(any(), any()) } returns listOf(dbEvent1, dbEvent2)
            every { eventsAdapter.adaptDbToDto(dbEvent1) } returns eventDto1
            every { eventsAdapter.adaptDbToDto(dbEvent2) } returns eventDto2

            // Act
            val result = eventsService.getEventsBetween(startDate, endDate)

            // Assert
            Assertions.assertEquals(2, result.size)
            Assertions.assertEquals(eventDto1, result[0])
            Assertions.assertEquals(eventDto2, result[1])

            // Verify
            verify(exactly = 1) { eventsRepository.findBetweenStartAndEnd(startDate, endDate) }
            verify(exactly = 1) { eventsAdapter.adaptDbToDto(dbEvent1) }
            verify(exactly = 1) { eventsAdapter.adaptDbToDto(dbEvent2) }
        }
    }

    @Nested
    @DisplayName("getEventById")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetEventByIdTest {
        @Test
        fun `should return event with the specified id`() {
            // Arrange
            val eventId = UUID.randomUUID()
            val dbEvent = mockk<Event>()
            val eventDto = mockk<EventDto>()

            every { eventsRepository.findByIdOrNull(eventId) } returns dbEvent
            every { eventsAdapter.adaptDbToDto(dbEvent) } returns eventDto

            // Act
            val result = eventsService.getEventById(eventId)

            // Assert
            Assertions.assertEquals(eventDto, result)

            // Verify
            verify(exactly = 1) { eventsRepository.findByIdOrNull(eventId) }
            verify(exactly = 1) { eventsAdapter.adaptDbToDto(dbEvent) }
        }

        @Test
        fun `should throw EventNotFoundException when event with the specified id does not exist`() {
            // Arrange
            val eventId = UUID.randomUUID()

            every { eventsRepository.findByIdOrNull(eventId) } returns null

            // Act & Assert
            Assertions.assertThrows(EventNotFoundException::class.java) {
                eventsService.getEventById(eventId)
            }

            // Verify
            verify(exactly = 1) { eventsRepository.findByIdOrNull(eventId) }
            verify(exactly = 0) { eventsAdapter.adaptDbToDto(any()) }
        }
    }

    @Nested
    @DisplayName("createEvent")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class CreateEventTest {
        @Test
        fun `should create a new event`() {
            // Arrange
            val eventDto = mockk<EventDto>()
            val dbEvent = mockk<Event>()
            val createdEventDto = mockk<EventDto>()

            every { eventsAdapter.adaptDtoToDb(eventDto) } returns dbEvent
            every { dbEvent.id } returns null
            every { eventsRepository.save(dbEvent) } returns dbEvent
            every { eventsAdapter.adaptDbToDto(dbEvent) } returns createdEventDto

            // Act
            val result = eventsService.createEvent(eventDto)

            // Assert
            Assertions.assertEquals(createdEventDto, result)

            // Verify
            verify(exactly = 1) { eventsAdapter.adaptDtoToDb(eventDto) }
            verify(exactly = 1) { dbEvent.id }
            verify(exactly = 1) { eventsRepository.save(dbEvent) }
            verify(exactly = 1) { eventsAdapter.adaptDbToDto(dbEvent) }
        }

        @Test
        fun `should throw BadRequestException when event id is provided`() {
            // Arrange
            val eventDto = mockk<EventDto>()
            val dbEvent = mockk<Event>()

            every { eventsAdapter.adaptDtoToDb(eventDto) } returns dbEvent
            every { dbEvent.id } returns UUID.randomUUID()

            // Act & Assert
            Assertions.assertThrows(BadRequestException::class.java) {
                eventsService.createEvent(eventDto)
            }

            // Verify
            verify(exactly = 1) { eventsAdapter.adaptDtoToDb(eventDto) }
            verify(exactly = 1) { dbEvent.id }
            verify(exactly = 0) { eventsRepository.save(any()) }
            verify(exactly = 0) { eventsAdapter.adaptDbToDto(any()) }
        }
    }

    @Nested
    @DisplayName("updateEvent")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class UpdateEventTest {
        @Test
        fun `should update the event with the specified id`() {
            // Arrange
            val eventId = UUID.randomUUID()
            val eventDto = EventDto(
                title = "test title",
                place = "test place",
                organizer = "test organizer",
                hasPoints = false,
                startDate = OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusDays(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )
            val dbEvent = Event(
                title = eventDto.title,
                place = eventDto.place,
                organizer = eventDto.organizer,
                hasPoints = eventDto.hasPoints,
                startDate = eventDto.startDate.toLocalDateTime(),
                endDate = eventDto.endDate.toLocalDateTime(),
                link = eventDto.link?.toURL(),
                id = eventDto?.id
            )
            val updatedEventDto = EventDto(
                title = "updated test title",
                place = "updated test place",
                organizer = "updated test organizer",
                hasPoints = true,
                startDate = OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusDays(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )

            every { eventsRepository.existsById(eventId) } returns true
            every { eventsRepository.findByIdOrNull(eventId) } returns dbEvent
            every { eventsAdapter.adaptDtoToDb(eventDto) } returns dbEvent
            every { eventsRepository.save(dbEvent) } returns dbEvent
            every { eventsAdapter.adaptDbToDto(dbEvent) } returns updatedEventDto

            // Act
            val result = eventsService.updateEvent(eventId, eventDto)

            // Assert
            Assertions.assertEquals(updatedEventDto, result)

            // Verify
            verify(exactly = 1) { eventsRepository.existsById(eventId) }
            verify(exactly = 1) { eventsRepository.findByIdOrNull(eventId) }
            verify(exactly = 1) { eventsRepository.save(dbEvent) }
            verify(exactly = 1) { eventsAdapter.adaptDbToDto(dbEvent) }
        }

        @Test
        fun `should throw EventNotFoundException when event with the specified id does not exist`() {
            // Arrange
            val eventId = UUID.randomUUID()
            val eventDto = mockk<EventDto>()

            every { eventsRepository.existsById(eventId) } returns false

            // Act & Assert
            Assertions.assertThrows(EventNotFoundException::class.java) {
                eventsService.updateEvent(eventId, eventDto)
            }

            // Verify
            verify(exactly = 1) { eventsRepository.existsById(eventId) }
            verify(exactly = 0) { eventsRepository.findByIdOrNull(any()) }
            verify(exactly = 0) { eventsAdapter.adaptDtoToDb(any()) }
            verify(exactly = 0) { eventsRepository.save(any()) }
            verify(exactly = 0) { eventsAdapter.adaptDbToDto(any()) }
        }
    }

    @Nested
    @DisplayName("deleteEvent")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class DeleteEventTest {
        @Test
        fun `should delete the event with the specified id`() {
            // Arrange
            val eventId = UUID.randomUUID()

            every { eventsRepository.existsById(eventId) } returns true
            every { eventsRepository.deleteById(eventId) } just Runs

            // Act
            eventsService.deleteEvent(eventId)

            // Verify
            verify(exactly = 1) { eventsRepository.existsById(eventId) }
            verify(exactly = 1) { eventsRepository.deleteById(eventId) }
        }

        @Test
        fun `should throw EventNotFoundException when event with the specified id does not exist`() {
            // Arrange
            val eventId = UUID.randomUUID()

            every { eventsRepository.existsById(eventId) } returns false

            // Act & Assert
            Assertions.assertThrows(EventNotFoundException::class.java) {
                eventsService.deleteEvent(eventId)
            }

            // Verify
            verify(exactly = 1) { eventsRepository.existsById(eventId) }
            verify(exactly = 0) { eventsRepository.deleteById(any()) }
        }
    }
}
