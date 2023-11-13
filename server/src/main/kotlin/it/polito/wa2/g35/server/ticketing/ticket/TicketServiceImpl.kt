package it.polito.wa2.g35.server.ticketing.ticket

import io.micrometer.observation.annotation.Observed
import it.polito.wa2.g35.server.products.ProductNotFoundException
import it.polito.wa2.g35.server.products.ProductService
import it.polito.wa2.g35.server.products.toProduct
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.employee.expert.*
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.order.OrderNotFoundException
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.order.WarrantyExpiredException
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusDTO
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusService
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*


@Service
class TicketServiceImpl(
    val ticketRepository: TicketRepository
) : TicketService {
    private val log: Logger = LoggerFactory.getLogger(TicketController::class.java)

    @Autowired
    lateinit var expertService: ExpertService

    @Autowired
    lateinit var customerService: CustomerService

    @Autowired
    lateinit var productService: ProductService

    @Autowired
    lateinit var ticketStatusService: TicketStatusService

    @Autowired
    lateinit var orderService: OrderService

    private fun filterResultByRole(auth: Authentication, resultTicket: TicketDTO?) : TicketDTO? {
        when (auth.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                return resultTicket
            }

            SecurityConfig.EXPERT_ROLE -> {
                if (resultTicket?.expert?.email == auth.name)
                    return resultTicket
                else
                    throw UnauthorizedTicketException("You can't access this ticket!")
            }

            SecurityConfig.CLIENT_ROLE -> {
                if (resultTicket?.customer?.email == auth.name)
                    return resultTicket
                else
                    throw UnauthorizedTicketException("You can't access this ticket!")
            }

            else -> {
                return null
            }
        }
    }

    private fun filterListResultByRole(auth: Authentication, resultList: List<TicketDTO>?) : List<TicketDTO> {
        return when (auth.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                resultList ?: emptyList()
            }
            SecurityConfig.EXPERT_ROLE -> {
                resultList?.filter { it.expert?.email == auth.name } ?: emptyList()
            }
            SecurityConfig.CLIENT_ROLE -> {
                resultList?.filter { it.customer.email == auth.name } ?: emptyList()
            }
            else -> {
                emptyList()
            }
        }
    }
    @Observed(
        name = "tickets",
        contextualName = "get-tickets-request-service"
    )
    override fun getAll(): List<TicketDTO> {
        log.info("Get tickets request from repository successful")
        return ticketRepository.findAll().map { it.toDTO() }
    }
    @Observed(
        name = "tickets/{ticketId}",
        contextualName = "get-ticket-by-id-request-service"
    )
    override fun getTicketById(id: Long): TicketDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val ticket = ticketRepository.findByIdOrNull(id)?.toDTO() ?: throw TicketNotFoundException("Ticket not found!")
        log.info("Get ticket by id request from repository successful")
        return filterResultByRole(authentication, ticket)
    }
    @Observed(
        name = "tickets/status/{status}",
        contextualName = "get-tickets-by-status-request-service"
    )
    override fun getTicketsByStatus(status: String): List<TicketDTO> {
        try {
            val statusValue = TicketStatusValues.valueOf(status.uppercase())
            val authentication = SecurityContextHolder.getContext().authentication
            val listTicket = ticketRepository.getTicketsByStatusOrderByCreationTimestampAsc(statusValue)?.map { it.toDTO() }
            log.info("Get tickets by status request from repository successful")
            return filterListResultByRole(authentication, listTicket)
        } catch (e: IllegalArgumentException) {
            log.error("Get tickets by status request from repository failed", e)
            throw TicketStatusValueInvalidException("Ticket status not valid!")
        }
    }

    override fun getTicketsByExpert(idExpert: String): List<TicketDTO> {
        val expert = expertService.getExpertById(idExpert)
        if (expert == null) {
            log.error("No Expert found with this Id: $idExpert")
            throw ProfileNotFoundException("No Expert found with this Id!")
        }
        val authentication = SecurityContextHolder.getContext().authentication
        val listTicket = ticketRepository.getTicketsByExpertIdOrderByCreationTimestampAsc(idExpert)?.map { it.toDTO() }
        log.info("Get tickets by expert request from repository successful")
        return filterListResultByRole(authentication, listTicket) as? List<TicketDTO> ?: emptyList()
    }
    @Observed(
        name = "tickets/priority/{priority}",
        contextualName = "get-tickets-by-priority-request-service"
    )
    override fun getTicketsByPriority(priority: String): List<TicketDTO> {
        try {
            val priorityValue = TicketPriority.valueOf(priority.uppercase())
            val authentication = SecurityContextHolder.getContext().authentication
            val listTicket = ticketRepository.getTicketsByPriorityOrderByCreationTimestampAsc(priorityValue)?.map { it.toDTO() }
            log.info("Get tickets by priority request from repository successful")
            return filterListResultByRole(authentication, listTicket)
        } catch (e: IllegalArgumentException) {
            log.error("Get tickets by priority request from repository failed", e)
            throw TicketPriorityInvalidException("Ticket priority not valid!")
        }
    }
    @Observed(
        name = "tickets/customer/{customerId}",
        contextualName = "get-tickets-by-customer-request-service"
    )
    override fun getTicketsByCustomer(idCustomer: String): List<TicketDTO> {
        val customer = customerService.getCustomerByEmail(idCustomer)
        if(customer == null) {
            log.error("No Customer found with this Id: $idCustomer")
            throw ProfileNotFoundException("Customer not found with this Id!")
        }
        val authentication = SecurityContextHolder.getContext().authentication
        val listTicket = ticketRepository.getTicketsByCustomerEmailOrderByCreationTimestampAsc(idCustomer)?.map { it.toDTO() }
        log.info("Get tickets by customer request from repository successful")
        return filterListResultByRole(authentication, listTicket)
    }

    @Observed(
        name = "tickets/",
        contextualName = "post-ticket-request-service"
    )
    @Transactional
    override fun createTicket(ticket: TicketInputDTO): TicketDTO? {
        val customer = customerService.getCustomerByEmail(ticket.customerId)
        if(customer == null) {
            log.error("No Customer found with this Id: $ticket.customerId")
            throw ProfileNotFoundException("Customer not found with this id!")
        }
        val product = productService.getProductById(ticket.productId)
            if(product==null){
                log.error("No Product found with this Id: $ticket.productId")
                throw ProductNotFoundException("Product not found with this id!")
            }
        val warranty = orderService.getOrderByCustomerAndProduct(customer.email, product.id)
            if(warranty == null){
                log.error("No Warranty found with those Customer: $ticket.customerId and Product: $ticket.productId")
                throw OrderNotFoundException("Order not found with this combination of product and customer!")
            }
        if (Date().after(warranty.warrantyDuration)) {
            log.error("Create ticket failed, order warranty expired")
            throw WarrantyExpiredException("Order warranty expired!")
        } else {
            val ticketToSave = ticketRepository.save(
                Ticket(
                    ticket.id,
                    Date(),
                    ticket.issueDescription,
                    null,
                    TicketStatusValues.OPEN,
                    null,
                    product.toProduct(),
                    customer.toCustomer(),
                    ticket.category
                )
            )
            ticketStatusService.createTicketStatus(
                TicketStatusDTO(
                    id = null,
                    statusTimestamp = null,
                    status = TicketStatusValues.OPEN,
                    description = ticketToSave.issueDescription,
                    ticket = ticketToSave,
                    expert = ticketToSave.expert,
                    category = ticketToSave.category
                )
            )
            log.info("Create ticket successful (repository)")
            return ticketToSave.toDTO()
        }
    }

    @Observed(
        name = "tickets/{ticketId}",
        contextualName = "put-ticket-request-service"
    )
    @Transactional
    override fun updateTicket(ticket: TicketInputDTO): TicketDTO? {
        val currentTicket = getTicketById(ticket.id!!)?.toTicket()
        if(currentTicket == null) {
            log.error("No Ticket found with this Id: $ticket.id")
            throw TicketNotFoundException("Ticket not found with this id!")
        }
        val expert = expertService.getExpertById(ticket.expertId)?.toExpert()
        if(expert == null){
            log.error("No Expert found with this Id: ${ticket.expertId}")
            throw ProfileNotFoundException("Expert not found with this id!")
            }
        if (!TicketStatusValues.checkStatusUpdateConsistency(currentTicket.status, ticket.status!!)) {
            log.error("Update Ticket failed by ticket status conflict")
            throw TicketStatusUpdateConflictException("Ticket Status update conflict!")
        }
        val authentication = SecurityContextHolder.getContext().authentication
        val ticketToUpdate: Ticket?
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                ticketToUpdate = accessGrantedUpdateTicket(currentTicket, ticket, expert)
            }
            else -> {
                log.error("Update ticket failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access this ticket!")
            }
        }
        if (currentTicket.status != ticketToUpdate.status || currentTicket.expert != ticketToUpdate.expert) {
            ticketStatusService.createTicketStatus(
                TicketStatusDTO(
                    id = null,
                    statusTimestamp = null,
                    status = ticketToUpdate.status,
                    description = ticketToUpdate.issueDescription,
                    ticket = ticketToUpdate,
                    expert = ticketToUpdate.expert,
                    category = ticketToUpdate.category
                )
            )
        }
        log.info("Update ticket successful (repository)")
        return ticketToUpdate.toDTO()
    }

    fun accessGrantedUpdateTicket(currentTicket: Ticket, ticket: TicketInputDTO, expert: Expert) : Ticket {
        val ticketToUpdate = ticketRepository.save(
            Ticket(
                currentTicket.id,
                currentTicket.creationTimestamp,
                ticket.issueDescription,
                ticket.priority?.let {
                    try {
                        TicketPriority.valueOf(it.uppercase())
                    } catch (e: IllegalArgumentException) {
                        throw TicketPriorityInvalidException("Ticket Priority not valid!")
                    }
                },
                try {
                    TicketStatusValues.valueOf(ticket.status!!.uppercase())
                } catch (e: IllegalArgumentException) {
                    throw TicketStatusValueInvalidException("Ticket Status not valid!")
                },
                expert,
                currentTicket.product,
                currentTicket.customer,
                ticket.category
            )
        )
        return ticketToUpdate
    }
    @Observed(
        name = "tickets/{ticketId}/status/{status}",
        contextualName = "put-ticket-status-request-service"
    )
    @Transactional
    override fun updateTicketStatus(ticketId: Long, statusValue: String): TicketDTO? {
        val ticket = getTicketById(ticketId)?.toTicket()
        if(ticket == null){
            log.error("No Ticket found with this Id: $ticketId")
            throw TicketNotFoundException("Ticket not found!")
        }
        val status = try {
            TicketStatusValues.valueOf(statusValue.uppercase())
        } catch (e: IllegalArgumentException) {
            log.error("Update ticket status failed by ticket status not valid")
            throw TicketStatusValueInvalidException("Ticket Status not valid!")
        }
        if (!TicketStatusValues.checkStatusUpdateConsistency(ticket.status, statusValue)) {
            log.error("Update ticket status failed by ticket status conflict")
            throw TicketStatusUpdateConflictException("Ticket Status update conflict!")
        }
        val authentication = SecurityContextHolder.getContext().authentication

        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                accessGrantedUpdateTicketStatus(ticket, status)
                log.info("Create ticket status successful (repository)")
                return ticket.toDTO()
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(ticket.expert?.email == authentication.name){
                    accessGrantedUpdateTicketStatus(ticket, status)
                    log.info("Create ticket status successful (repository)")
                    return ticket.toDTO()
                }
                else {
                    log.error("Update ticket status failed by unauthorized access")
                    throw UnauthorizedTicketException("You can't access this ticket!")
                }
            }
            else -> {
                log.error("Update ticket status failed by unauthorized access")
                throw UnauthorizedTicketException("You can't access this ticket!")
            }
        }
    }


    fun accessGrantedUpdateTicketStatus(ticket: Ticket, status: TicketStatusValues) {
        ticket.status = status
        ticketRepository.save(ticket)
        ticketStatusService.createTicketStatus(
            TicketStatusDTO(
                id = null,
                statusTimestamp = null,
                status = ticket.status,
                description = ticket.issueDescription,
                ticket = ticket,
                expert = ticket.expert,
                category = ticket.category
            )
        )
    }
    @Observed(
        name = "tickets/{ticketId}/priority/{priority}",
        contextualName = "put-ticket-priority-request-service"
    )
    override fun updateTicketPriority(ticketId: Long, priorityValue: String): TicketDTO? {
        val ticket = getTicketById(ticketId)?.toTicket()
        if (ticket == null) {
            log.error("No Ticket found with this Id: $ticketId")
            throw TicketNotFoundException("Ticket not found!")
        }
        val priority = try {
            TicketPriority.valueOf(priorityValue.uppercase())
        } catch (e: IllegalArgumentException) {
            log.error("Update ticket priority failed (repository)", e)
            throw TicketPriorityInvalidException("Ticket Priority not valid!")
        }
        ticket.priority = priority
        log.info("Update ticket priority successful (repository)")
        return ticketRepository.save(ticket).toDTO()
    }

    fun accessGrantedUpdateTicketExpert(ticket: Ticket, expertId: String) {
        val expert = expertService.getExpertById(expertId)?.toExpert()
        if (expert == null) {
            log.error("No Expert found with this ID: $expertId")
        }

        ticket.expert = expert
        ticketRepository.save(ticket)

        ticketStatusService.createTicketStatus(
            TicketStatusDTO(
                id = null,
                statusTimestamp = null,
                status = ticket.status,
                description = ticket.issueDescription,
                ticket = ticket,
                expert = ticket.expert,
                category = ticket.category
            )
        )
    }

    @Observed(
            name = "tickets/{ticketId}/expertId/{expertId}",
            contextualName = "put-ticket-expertId-request-service"
    )
    override fun updateTicketExpert(ticketId: Long, expertId: String): TicketDTO? {
        val ticket = getTicketById(ticketId)?.toTicket()
        if (ticket == null) {
            log.error("No Ticket found with this Id: $ticketId")
            throw TicketNotFoundException("Ticket not found!")
        }

        accessGrantedUpdateTicketExpert(ticket, expertId)

        log.info("Update expert successful (repository)")
        return ticketRepository.save(ticket).toDTO()
    }




}
