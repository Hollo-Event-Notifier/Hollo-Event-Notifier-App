package hu.hollo.news

import hu.hollo.news.model.RsaKeyProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyProperties::class)
class NewsApplication

fun main(args: Array<String>) {
	runApplication<NewsApplication>(*args)
}
