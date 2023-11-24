package it.polito.wa2.g35.server.notifications

import org.springframework.stereotype.Service

interface NotificationService {
    fun send(notification: Notification);
}