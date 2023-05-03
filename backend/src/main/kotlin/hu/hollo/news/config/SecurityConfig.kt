package hu.hollo.news.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy.STATELESS
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.util.WebUtils

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(
        http: HttpSecurity,
        @Value("\${auth_cookie_name}") cookieName: String
    ): SecurityFilterChain = http
        .sessionManagement { it.sessionCreationPolicy(STATELESS) }
        .csrf { it.disable() }
        .cors {
            val config = CorsConfiguration()
            config.allowedOrigins = listOf("http://localhost:4200")
            config.allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE")
            config.allowedHeaders = listOf("Authorization", "Content-Type")
            config.allowCredentials = true
            val source = UrlBasedCorsConfigurationSource()
            source.registerCorsConfiguration("/**", config)
            it.configurationSource(source)
        }
        .headers {
            it.xssProtection()
            it.contentSecurityPolicy("script-src 'self'")
        }
        .authorizeHttpRequests {
            it.requestMatchers("/users/login").permitAll()
            it.requestMatchers(HttpMethod.GET,"/events").permitAll()
            it.anyRequest().authenticated()
        }
        .oauth2ResourceServer {
            it.jwt()
            it.bearerTokenResolver { req -> WebUtils.getCookie(req, cookieName)?.value }
        }
        .build()

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()
}