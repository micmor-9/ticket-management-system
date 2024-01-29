package it.polito.wa2.g35.server.notifications

import com.fasterxml.jackson.databind.ObjectMapper
import org.apache.kafka.common.errors.SerializationException
import org.apache.kafka.common.serialization.Serializer
import org.slf4j.LoggerFactory

class NotificationSerializer : Serializer<Notification> {
    private val objectMapper = ObjectMapper()
    private val log = LoggerFactory.getLogger(javaClass)

    override fun serialize(topic: String?, data: Notification?): ByteArray? {
        //log.info("Serializing...")
        return objectMapper.writeValueAsString(data)
            ?.toByteArray(Charsets.UTF_8)
    }

    override fun close() {}
}