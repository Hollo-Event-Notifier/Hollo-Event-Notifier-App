package hu.hollo.news.config

import hu.hollo.news.model.db.Event
import hu.hollo.news.model.db.Role
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
            username = "vbkristof",
            password = passwordEncoder.encode("pwd"),
            role = Role.SystemAdmin,
            email = "kristofvargabalazs@gmail.com"
        ),
        User(
            username = "ferenczyandras",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy.business@gmail.com"
        ),
        User(
            username = "ferenczyandras2",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy2.business@gmail.com"
        ),
        User(
            username = "ferenczyandras3",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy3.business@gmail.com"
        ),
        User(
            username = "ferenczyandras4",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy4.business@gmail.com"
        ),
        User(
            username = "ferenczyandras5",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy5.business@gmail.com"
        ),
        User(
            username = "ferenczyandras6",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy6.business@gmail.com"
        ),
        User(
            username = "ferenczyandras7",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy7.business@gmail.com"
        ),
        User(
            username = "ferenczyandras8",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy8.business@gmail.com"
        ),
        User(
            username = "ferenczyandras9",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy9.business@gmail.com"
        ),
        User(
            username = "ferenczyandras10",
            password = passwordEncoder.encode("pwd"),
            role = Role.EventAdmin,
            email = "aferenczy10.business@gmail.com"
        ),
    )

    private val events = listOf(
        Event(
            title = "A demokrácia hanyatlása a digitális korban",
            place = "Kávézó",
            organizer = "Lunch Talks",
            hasPoints = false,
            startDate = LocalDateTime.parse("2023-05-01T12:00:00.00"),
            endDate = LocalDateTime.parse("2023-05-01T15:00:00.00"),
        ),
        Event(
            title = "Európa szerepe a világban",
            place = "101-es terem",
            organizer = "Magyar-Német Intézet",
            hasPoints = true,
            startDate = LocalDateTime.parse("2023-05-01T17:00:00.00"),
            endDate = LocalDateTime.parse("2023-05-01T20:00:00.00"),
        ),
        Event(
            title = "Akkumulátoripar - töltőre tett gazdaság",
            place = "Kávézó",
            organizer = "Lunch Talks",
            hasPoints = true,
            startDate = LocalDateTime.parse("2023-05-02T09:00:00.00"),
            endDate = LocalDateTime.parse("2023-05-02T11:00:00.00"),
        ),
        Event(
            title = "Környezetvédelmi akció a feneketlen tó körül",
            place = "204-es terem",
            organizer = "Ifjuságkutató Intézet",
            hasPoints = false,
            startDate = LocalDateTime.parse("2023-05-03T16:00:00.00"),
            endDate = LocalDateTime.parse("2023-05-03T19:00:00.00"),
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