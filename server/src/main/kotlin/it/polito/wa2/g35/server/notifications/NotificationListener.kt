package it.polito.wa2.g35.server.notifications

import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.support.Acknowledgment
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class NotificationListener {
    @Autowired
    lateinit var template: SimpMessagingTemplate

    private val logger = LoggerFactory.getLogger(javaClass)

    @KafkaListener(topics = ["\${spring.kafka.topics.notifications}"], groupId = "ppr")
    fun listenGroupFoo(consumerRecord: ConsumerRecord<String, Notification>, ack: Acknowledgment) {
        logger.info("Notification received {}", consumerRecord)
        val notification = consumerRecord.value()
        println(notification);
        for(recipient in notification.recipientIds) {
            println(recipient);
            template.convertAndSend("/topic/notifications-$recipient", notification)
        }
        ack.acknowledge()
    }
}