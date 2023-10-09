package it.polito.wa2.g35.server.ticketing.ticket

interface TicketService {
    fun getAll() : List<TicketDTO>

    fun getTicketById(id: Long) : TicketDTO?

    fun getTicketsByStatus(status: String): List<TicketDTO>

    fun getTicketsByExpert(idExpert: String): List<TicketDTO>

    fun getTicketsByPriority(priority: String): List<TicketDTO>

    fun getTicketsByCustomer(idCustomer: String) : List<TicketDTO>

    fun createTicket(ticket: TicketInputDTO) : TicketDTO?

    fun updateTicket(ticket: TicketInputDTO) : TicketDTO?

    fun updateTicketStatus(ticketId: Long, statusValue: String) : TicketDTO?

    fun updateTicketPriority(ticketId: Long, priorityValue: String) : TicketDTO?

    fun updateTicketExpert(ticketId: Long, expertId: String) : TicketDTO?
}