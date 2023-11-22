package it.polito.wa2.g35.server.notifications

import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Deserializer
import org.slf4j.LoggerFactory
import kotlin.text.Charsets.UTF_8

class NotificationDeserializer : Deserializer<Notification> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun deserialize(topic: String?, data: ByteArray?): Notification? {
        log.info("Deserializing...")
        return objectMapper.readValue(
            data?.toString(Charsets.UTF_8),
            Notification::class.java
        )
    }

    override fun close() {}
}