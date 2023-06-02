package hu.hollo.news.repository

import hu.hollo.news.model.db.Event
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.LocalDateTime
import java.util.*

@Repository
interface EventsRepository : JpaRepository<Event, UUID> {
    @Query("SELECT e FROM Event e WHERE e.startDate >= :startDate and e.endDate <= :endDate")
    fun findBetweenStartAndEnd(
        startDate: LocalDateTime,
        endDate: LocalDateTime
    ): List<Event>
}