package hu.hollo.news.utils

import org.springframework.core.io.ClassPathResource
import java.io.FileNotFoundException

fun readResource(path: String): String {
    return try {
        ClassPathResource(path).file.readText()
    } catch (e: Exception) {
        throw FileNotFoundException("File not found: $path")
    }
}