package hu.hollo.news.service.adapter

import hu.hollo.news.model.db.User
import hu.hollo.news.model.dto.UserDto
import org.springframework.stereotype.Service

@Service
class UserAdapter(private val roleAdapter: RoleAdapter) : Adapter<UserDto, User> {
    override fun adaptDtoToDb(dto: UserDto) = User(
        username = dto.username,
        email = dto.email,
        role = roleAdapter.adaptDtoToDb(dto.role),
        id = dto.id
    )

    override fun adaptDbToDto(db: User) = UserDto(
        username = db.username,
        email = db.email,
        role = roleAdapter.adaptDbToDto(db.role),
        id = db.id
    )
}
