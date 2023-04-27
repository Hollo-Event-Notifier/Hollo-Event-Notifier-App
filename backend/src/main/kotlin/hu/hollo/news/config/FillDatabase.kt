package hu.hollo.news.config

import hu.hollo.news.model.db.Event
import hu.hollo.news.model.db.User
import hu.hollo.news.repository.EventsRepository
import hu.hollo.news.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime

@Configuration
class FillDatabase(passwordEncoder: PasswordEncoder) {
    private val saveEntities = true // set this to true, to persist entities

    private val users = listOf(
        User(
            "vbkristof",
            passwordEncoder.encode("password"),
            "kristofvargabalazs@gmail.com",
        )
    )

    private val events = listOf(
        Event(
            title = "A demokrácia hanyatlása a digitális korban",
            place = "Kávézó",
            organizer = "Lunch Talks",
            hasPoints = false,
            startDate = LocalDateTime.parse("2023-04-24T12:00:00.00"),
            endDate = LocalDateTime.parse("2023-04-24T15:00:00.00"),
        ),
        Event(
            title = "Európa szerepe a világban",
            place = "101-es terem",
            organizer = "Magyar-Német Intézet",
            hasPoints = true,
            startDate = LocalDateTime.parse("2023-04-24T17:00:00.00"),
            endDate = LocalDateTime.parse("2023-04-24T20:00:00.00"),
        ),
        Event(
            title = "Akkumulátoripar - töltőre tett gazdaság",
            place = "Kávézó",
            organizer = "Lunch Talks",
            hasPoints = true,
            startDate = LocalDateTime.parse("2023-04-25T09:00:00.00"),
            endDate = LocalDateTime.parse("2023-04-25T11:00:00.00"),
        ),
        Event(
            title = "Környezetvédelmi akció a feneketlen tó körül",
            place = "204-es terem",
            organizer = "Ifjuságkutató Intézet",
            hasPoints = false,
            startDate = LocalDateTime.parse("2023-04-26T16:00:00.00"),
            endDate = LocalDateTime.parse("2023-04-26T19:00:00.00"),
        ),
    );


    @Bean
    fun fill(
        userRepository: UserRepository,
        eventsRepository: EventsRepository
    ) = CommandLineRunner {
        if (saveEntities) {
            userRepository.saveAll(users)
            eventsRepository.saveAll(events)
        }
    }
}