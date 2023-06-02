package it.polito.wa2.g35.server.ticketing.ticketStatus

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.ticketing.ticket.TicketController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.*


@Service
class TicketStatusServiceImpl(private val ticketStatusRepository: TicketStatusRepository) : TicketStatusService{
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)
    @Observed(
        name = "status/",
        contextualName = "post-ticket-status-request-service"
    )
    override fun createTicketStatus(ticketStatus: TicketStatusDTO): TicketStatusDTO? {
        log.info("Create tickets status request successful (repository)")
        return ticketStatusRepository.save(TicketStatus(ticketStatus.id, Date(), ticketStatus.status, ticketStatus.description, ticketStatus.ticket, ticketStatus.expert )).toDTO()
    }
    @Observed(
        name = "status/{ticketId}",
        contextualName = "get-ticket-status-request-service"
    )
    override fun getTicketStatusesByTicketId(ticketId: Long): List<TicketStatusDTO> {
        log.info("Get tickets status by Id from repository request successful")
        return ticketStatusRepository.getTicketStatusesByTicketId(ticketId).map { it.toDTO() }
    }
}