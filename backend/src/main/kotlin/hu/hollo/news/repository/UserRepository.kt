package hu.hollo.news.repository

import hu.hollo.news.model.db.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface UserRepository : JpaRepository<User, UUID> {
    fun findByUsername(username: String): User?
    fun existsByEmail(email: String): Boolean
    fun existsByUsername(username: String): Boolean
}