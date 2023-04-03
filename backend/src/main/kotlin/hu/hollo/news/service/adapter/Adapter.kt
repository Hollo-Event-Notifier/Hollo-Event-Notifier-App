package hu.hollo.news.service.adapter

sealed interface Adapter<DtoType, DbType> {
    fun adaptDtoToDb(dto: DtoType): DbType
    fun adaptDbToDto(db: DbType): DtoType
}