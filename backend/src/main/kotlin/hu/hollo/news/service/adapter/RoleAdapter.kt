package hu.hollo.news.service.adapter

import hu.hollo.news.model.db.Role
import hu.hollo.news.model.dto.UserDto
import org.springframework.stereotype.Service

@Service
class RoleAdapter : Adapter<UserDto.Role, Role> {
    override fun adaptDtoToDb(dto: UserDto.Role): Role = when (dto) {
        UserDto.Role.systemAdmin -> Role.SystemAdmin
        UserDto.Role.eventAdmin -> Role.EventAdmin
    }

    override fun adaptDbToDto(db: Role): UserDto.Role = when (db) {
        Role.SystemAdmin -> UserDto.Role.systemAdmin
        Role.EventAdmin -> UserDto.Role.eventAdmin
    }
}