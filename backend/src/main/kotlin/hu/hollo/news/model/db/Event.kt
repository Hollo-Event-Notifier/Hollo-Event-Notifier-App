package hu.hollo.news.model.db

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import org.hibernate.annotations.GenericGenerator
import java.net.URL
import java.time.LocalDateTime
import java.util.*

@Entity
class Event(
    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var place: String,

    @Column(nullable = false)
    var organizer: String,

    @Column(nullable = false)
    var hasPoints: Boolean,

    @Column(nullable = false)
    var startDate: LocalDateTime,

    @Column(nullable = false)
    var endDate: LocalDateTime,

    var link: URL? = null,

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
        name = "UUID",
        strategy = "org.hibernate.id.UUIDGenerator"
    )
    val id: UUID? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null) return false
        if (javaClass != other.javaClass) return false
        return id != null && id == (other as Event).id
    }

    override fun hashCode() = 13

    override fun toString(): String {
        return "${this.javaClass.simpleName}(title='$title', place='$place', hasPoints='$hasPoints',  " +
                "startDate='$startDate', endDate='$endDate, link='$link, id='$id')"
    }
}