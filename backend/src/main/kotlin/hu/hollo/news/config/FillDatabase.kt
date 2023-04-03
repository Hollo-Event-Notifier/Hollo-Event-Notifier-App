package hu.hollo.news.config

import hu.hollo.news.model.db.User
import hu.hollo.news.repository.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder

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


    @Bean
    fun fill(userRepository: UserRepository) = CommandLineRunner {
        if (saveEntities) {
            userRepository.saveAll(users)
        }
    }
}