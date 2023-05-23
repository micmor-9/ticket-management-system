package it.polito.wa2.g35.server.ticketing.ticketStatus

interface TicketStatusService {

    fun createTicketStatus(ticketStatus: TicketStatusDTO) : TicketStatusDTO?

    fun getTicketStatusesByTicketId(ticketId: Long) : List<TicketStatusDTO>

}