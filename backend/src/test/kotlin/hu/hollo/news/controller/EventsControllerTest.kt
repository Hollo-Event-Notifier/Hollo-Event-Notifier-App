package hu.hollo.news.controller

import hu.hollo.news.model.dto.EventDto
import hu.hollo.news.service.EventsService
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.*
import org.springframework.http.HttpStatus
import java.net.URI
import java.time.OffsetDateTime
import java.util.*

class EventsControllerTest {
    private lateinit var eventsService: EventsService
    private lateinit var eventsController: EventsController

    @BeforeEach
    fun setup() {
        eventsService = mockk()
        eventsController = EventsController(eventsService)
    }

    @Nested
    @DisplayName("getEvents")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class GetEventsTest {
        @Test
        fun `should return events between start and end date`() {
            // Arrange
            val startDate = OffsetDateTime.parse("2023-01-01T00:00:00Z")
            val endDate = OffsetDateTime.parse("2023-01-31T23:59:59Z")
            val eventDto1 = EventDto(
                title = "Event 1",
                place = "Place 1",
                organizer = "Organizer 1",
                hasPoints = true,
                startDate= OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusHours(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )
            val eventDto2 = EventDto(
                title = "Event 2",
                place = "Place 2",
                organizer = "Organizer 2",
                hasPoints = true,
                startDate= OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusHours(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )
            val expectedResponse = listOf(eventDto1, eventDto2)

            every { eventsService.getEventsBetween(any(), any()) } returns expectedResponse

            // Act
            val response = eventsController.getEvents(startDate, endDate)

            // Assert
            Assertions.assertEquals(HttpStatus.OK, response.statusCode)
            Assertions.assertEquals(expectedResponse, response.body)
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
            val eventDto = EventDto(
                title = "Event 1",
                place = "Place 1",
                organizer = "Organizer 1",
                hasPoints = true,
                startDate= OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusHours(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )

            every { eventsService.getEventById(eventId) } returns eventDto

            // Act
            val response = eventsController.getEventById(eventId)

            // Assert
            Assertions.assertEquals(HttpStatus.OK, response.statusCode)
            Assertions.assertEquals(eventDto, response.body)
        }
    }

    @Nested
    @DisplayName("createEvent")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class CreateEventTest {
        @Test
        fun `should create a new event`() {
            // Arrange
            val eventDto = EventDto(
                title = "Event 1",
                place = "Place 1",
                organizer = "Organizer 1",
                hasPoints = true,
                startDate= OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusHours(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )

            every { eventsService.createEvent(eventDto) } returns eventDto

            // Act
            val response = eventsController.createEvent(eventDto)

            // Assert
            Assertions.assertEquals(HttpStatus.CREATED, response.statusCode)
            Assertions.assertEquals(eventDto, response.body)
        }
    }

    @Nested
    @DisplayName("updateEventById")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class UpdateEventByIdTest {
        @Test
        fun `should update the event with the specified id`() {
            // Arrange
            val eventId = UUID.randomUUID()
            val eventDto = EventDto(
                title = "Event 1",
                place = "Place 1",
                organizer = "Organizer 1",
                hasPoints = true,
                startDate= OffsetDateTime.now(),
                endDate = OffsetDateTime.now().plusHours(1),
                link = URI.create("https://example.com"),
                id = UUID.randomUUID()
            )

            every { eventsService.updateEvent(eventId, eventDto) } returns eventDto

            // Act
            val response = eventsController.updateEventById(eventId, eventDto)

            // Assert
            Assertions.assertEquals(HttpStatus.OK, response.statusCode)
            Assertions.assertEquals(eventDto, response.body)
        }
    }

    @Nested
    @DisplayName("deleteEventById")
    @TestInstance(TestInstance.Lifecycle.PER_CLASS)
    inner class DeleteEventByIdTest {
        @Test
        fun `should delete the event with the specified id`() {
            // Arrange
            val eventId = UUID.randomUUID()

            every { eventsService.deleteEvent(eventId) } returns Unit

            // Act
            val response = eventsController.deleteEventById(eventId)

            // Assert
            Assertions.assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
        }
    }
}
