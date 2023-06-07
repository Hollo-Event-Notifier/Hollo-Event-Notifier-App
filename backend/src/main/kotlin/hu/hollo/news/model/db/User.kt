package hu.hollo.news.model.db

import jakarta.persistence.*
import org.hibernate.annotations.GenericGenerator
import java.util.*
import javax.validation.constraints.Email

@Entity
@Table(name = "users")
class User(
    @Column(
        nullable = false,
        unique = true,
    )
    var username: String,

    @Email
    @Column(
        nullable = false,
        unique = true,
    )
    var email: String,

    @Column(nullable = false)
    var role: Role,

    @Column(nullable = false)
    var approved: Boolean,

    @Column(nullable = false)
    var password: String = "",

    @Column(
        unique = true,
        nullable = false
    )
    val approvementId: UUID = UUID.randomUUID(),

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
        return approvementId != null && approvementId == (other as User).approvementId
    }

    override fun hashCode() = 13

    override fun toString(): String {
        return "${this.javaClass.simpleName}(username='$username', password='$password', email='$email', role='$role',  approved='$approved' approvementId='$approvementId' id='$id')"
    }
}