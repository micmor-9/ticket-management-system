package it.polito.wa2.g35.server.ticketing.ticketStatus

import org.springframework.stereotype.Service
import java.util.*


@Service
class TicketStatusServiceImpl(private val ticketStatusRepository: TicketStatusRepository) : TicketStatusService{

    override fun createTicketStatus(ticketStatus: TicketStatusDTO): TicketStatusDTO? {
        return ticketStatusRepository.save(TicketStatus(ticketStatus.id, Date(), ticketStatus.status, ticketStatus.description, ticketStatus.ticket, ticketStatus.expert )).toDTO()
    }

    override fun getTicketStatusesByTicketId(ticketId: Long): List<TicketStatusDTO> {
        return ticketStatusRepository.getTicketStatusesByTicketId(ticketId).map { it.toDTO() }
    }
}