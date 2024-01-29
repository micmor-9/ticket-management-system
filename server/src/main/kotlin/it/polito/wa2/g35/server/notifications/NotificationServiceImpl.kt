package it.polito.wa2.g35.server.notifications

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.support.KafkaHeaders
import org.springframework.messaging.Message
import org.springframework.messaging.support.MessageBuilder
import org.springframework.stereotype.Service

@Service
class NotificationServiceImpl : NotificationService {
    @Autowired
    lateinit var kafkaTemplate: KafkaTemplate<String, Any>

    @Value("\${spring.kafka.topics.notifications}")
    lateinit var topic: String

    private val log: Logger = LoggerFactory.getLogger(javaClass)
    override fun send(notification: Notification) {
        //log.info("Receiving notification request")
        //log.info("Sending notification to Kafka {}", notification)
        val message: Message<Notification> = MessageBuilder
            .withPayload(notification)
            .setHeader(KafkaHeaders.TOPIC, topic)
            .setHeader(KafkaHeaders.GROUP_ID, "kafka-notifications")
            .build()
        kafkaTemplate.send(message)
        //log.info("Message sent with success")
    }
}