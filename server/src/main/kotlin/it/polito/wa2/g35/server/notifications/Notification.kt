package it.polito.wa2.g35.server.notifications

import com.fasterxml.jackson.annotation.JsonProperty
import java.util.Date

data class Notification(
    @JsonProperty("url")
    val url: String,
    @JsonProperty("title")
    val title: String,
    @JsonProperty("description")
    val description: String,
    @JsonProperty("recipientIds")
    val recipientIds: List<Any>,
    @JsonProperty("senderId")
    val senderId: Long?,
    @JsonProperty("timestamp")
    val timestamp: Date
)