package hu.hollo.news.service

import hu.hollo.news.exception.EmailNotSentException
import jakarta.mail.MessagingException
import jakarta.mail.internet.MimeMessage
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.util.*

@Service
class EmailService(
    private val emailSender: JavaMailSender,
    private val templateEngine: TemplateEngine
) {
    companion object {
        private val log = LoggerFactory.getLogger(Companion::class.java)
    }

    private enum class EmailType(val filename: String) {
        REGISTRATION("email/registration_confirmation_email.html"),
    }

    @Value("\${spring.mail.username}")
    lateinit var sender: String

    fun sendRegistrationEmail(recipient: String, approvementId: UUID) {
        val subject = "Confirmation of your registration"

        val msg: MimeMessage = emailSender.createMimeMessage()

        try {
            val helper = MimeMessageHelper(msg, true)

            helper.setFrom(sender)
            helper.setTo(recipient)
            helper.setSubject(subject)

            val context = Context()
            context.setVariable("link", "http://localhost:8080/users/approve/$approvementId")
            val emailContent: String = templateEngine.process(EmailType.REGISTRATION.filename, context)


            helper.setText(emailContent, true)

            emailSender.send(msg)
            log.info("email sent successfully")
        } catch (e: MessagingException) {
            log.error("email not sent: ${e.message}")
            throw EmailNotSentException("email not sent: ${e.message}")
        }
    }
}