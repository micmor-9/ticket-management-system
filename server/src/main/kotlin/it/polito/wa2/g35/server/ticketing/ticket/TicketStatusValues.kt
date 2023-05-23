package it.polito.wa2.g35.server.ticketing.ticket

enum class TicketStatusValues {
    OPEN,
    IN_PROGRESS,
    CLOSED,
    RESOLVED,
    REOPENED;

    companion object {
        fun checkStatusUpdateConsistency(oldStatus: TicketStatusValues, newStatus: String) : Boolean {
            val newTicketStatus = try {TicketStatusValues.valueOf(newStatus.uppercase())} catch (e : IllegalArgumentException) {
                throw TicketStatusValueInvalidException("Ticket Status not valid!")
            }
            if(oldStatus != newTicketStatus) {
                when (oldStatus) {
                    OPEN -> {
                        return newTicketStatus in arrayOf(IN_PROGRESS, RESOLVED, CLOSED)
                    }
                    IN_PROGRESS -> {
                        return newTicketStatus in arrayOf(RESOLVED, CLOSED)
                    }
                    CLOSED -> {
                        return newTicketStatus in arrayOf(REOPENED)
                    }
                    RESOLVED -> {
                        return newTicketStatus in arrayOf(REOPENED, CLOSED)
                    }
                    REOPENED -> {
                        return newTicketStatus in arrayOf(RESOLVED, CLOSED, IN_PROGRESS)
                    }
                }
            } else {
                return true;
            }
        }
    }
}