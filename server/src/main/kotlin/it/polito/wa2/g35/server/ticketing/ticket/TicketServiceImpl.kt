package it.polito.wa2.g35.server.ticketing.ticket

import it.polito.wa2.g35.server.products.ProductNotFoundException
import it.polito.wa2.g35.server.products.ProductService
import it.polito.wa2.g35.server.products.toProduct
import it.polito.wa2.g35.server.profiles.customer.CustomerService
import it.polito.wa2.g35.server.profiles.customer.toCustomer
import it.polito.wa2.g35.server.profiles.employee.expert.ExpertService
import it.polito.wa2.g35.server.profiles.employee.expert.toExpert
import it.polito.wa2.g35.server.profiles.ProfileNotFoundException
import it.polito.wa2.g35.server.profiles.employee.expert.Expert
import it.polito.wa2.g35.server.security.SecurityConfig
import it.polito.wa2.g35.server.ticketing.order.OrderNotFoundException
import it.polito.wa2.g35.server.ticketing.order.OrderService
import it.polito.wa2.g35.server.ticketing.order.WarrantyExpiredException
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusDTO
import it.polito.wa2.g35.server.ticketing.ticketStatus.TicketStatusService
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

    override fun getAll(): List<TicketDTO> {
        return ticketRepository.findAll().map { it.toDTO() }
    }

    override fun getTicketById(id: Long): TicketDTO? {
        val authentication = SecurityContextHolder.getContext().authentication
        val ticket = ticketRepository.findByIdOrNull(id)?.toDTO() ?: throw TicketNotFoundException("Ticket not found!")
        return filterResultByRole(authentication, ticket)
    }

    override fun getTicketsByStatus(status: String): List<TicketDTO> {
        try {
            val statusValue = TicketStatusValues.valueOf(status.uppercase())
            val authentication = SecurityContextHolder.getContext().authentication
            val listTicket = ticketRepository.getTicketsByStatus(statusValue)?.map { it.toDTO() }
            return filterListResultByRole(authentication, listTicket)
        } catch (e: IllegalArgumentException) {
            throw TicketStatusValueInvalidException("Ticket status not valid!")
        }
    }

    override fun getTicketsByExpert(idExpert: String): List<TicketDTO> {
        expertService.getExpertById(idExpert) ?: throw ProfileNotFoundException("No Expert found with this Id!")
        val authentication = SecurityContextHolder.getContext().authentication
        val listTicket = ticketRepository.getTicketsByExpertId(idExpert)?.map { it.toDTO() }
        return filterListResultByRole(authentication, listTicket) as? List<TicketDTO> ?: emptyList()
    }

    override fun getTicketsByPriority(priority: String): List<TicketDTO> {
        try {
            val priorityValue = TicketPriority.valueOf(priority.uppercase())
            val authentication = SecurityContextHolder.getContext().authentication
            val listTicket = ticketRepository.getTicketsByPriority(priorityValue)?.map { it.toDTO() }
            return filterListResultByRole(authentication, listTicket)
        } catch (e: IllegalArgumentException) {
            throw TicketPriorityInvalidException("Ticket priority not valid!")
        }
    }

    override fun getTicketsByCustomer(idCustomer: String): List<TicketDTO> {
        customerService.getCustomerByEmail(idCustomer)
            ?: throw ProfileNotFoundException("Customer not found with this Id!")
        val authentication = SecurityContextHolder.getContext().authentication
        val listTicket = ticketRepository.getTicketsByCustomerEmail(idCustomer)?.map { it.toDTO() }
        return filterListResultByRole(authentication, listTicket)
    }

    @Transactional
    override fun createTicket(ticket: TicketInputDTO): TicketDTO? {
        val customer = customerService.getCustomerByEmail(ticket.customerId)
            ?: throw ProfileNotFoundException("Customer not found with this id!")
        val product = productService.getProductById(ticket.productId)
            ?: throw ProductNotFoundException("Product not found with this id!")
        val warranty = orderService.getOrderByCustomerAndProduct(customer.email, product.id)
            ?: throw OrderNotFoundException("Order not found with this combination of product and customer!")
        if (Date().after(warranty.warrantyDuration)) {
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
                )
            )
            ticketStatusService.createTicketStatus(
                TicketStatusDTO(
                    id = null,
                    statusTimestamp = null,
                    status = TicketStatusValues.OPEN,
                    description = ticketToSave.issueDescription,
                    ticket = ticketToSave,
                    expert = ticketToSave.expert
                )
            )
            return ticketToSave.toDTO()
        }
    }


    @Transactional
    override fun updateTicket(ticket: TicketInputDTO): TicketDTO? {
        val currentTicket =
            getTicketById(ticket.id!!)?.toTicket() ?: throw TicketNotFoundException("Ticket not found with this id!")
        val expert = expertService.getExpertById(ticket.expertId)?.toExpert()
            ?: throw ProfileNotFoundException("Expert not found with this id!")
        if (!TicketStatusValues.checkStatusUpdateConsistency(currentTicket.status, ticket.status!!))
            throw TicketStatusUpdateConflictException("Ticket Status update conflict!")

        val authentication = SecurityContextHolder.getContext().authentication
        var ticketToUpdate: Ticket?
        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                ticketToUpdate = accessGrantedUpdateTicket(currentTicket, ticket, expert)
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(currentTicket.expert?.email == authentication.name) {
                    ticketToUpdate = accessGrantedUpdateTicket(currentTicket, ticket, expert)
                }
                else
                    throw UnauthorizedTicketException("You can't access this ticket!")
                   }
            else -> {
                throw UnauthorizedTicketException("You can't access this ticket!")
            }
        }
        if (currentTicket.status != ticketToUpdate.status) {
            ticketStatusService.createTicketStatus(
                TicketStatusDTO(
                    id = null,
                    statusTimestamp = null,
                    status = ticketToUpdate.status,
                    description = ticketToUpdate.issueDescription,
                    ticket = ticketToUpdate,
                    expert = ticketToUpdate.expert
                )
            )
        }
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
                currentTicket.customer
            )
        )
        return ticketToUpdate
    }

    @Transactional
    override fun updateTicketStatus(ticketId: Long, statusValue: String): TicketDTO? {
        var ticket = getTicketById(ticketId)?.toTicket() ?: throw TicketNotFoundException("Ticket not found!")
        val status = try {
            TicketStatusValues.valueOf(statusValue.uppercase())
        } catch (e: IllegalArgumentException) {
            throw TicketStatusValueInvalidException("Ticket Status not valid!")
        }
        if (!TicketStatusValues.checkStatusUpdateConsistency(ticket.status, statusValue))
            throw TicketStatusUpdateConflictException("Ticket Status update conflict!")

        val authentication = SecurityContextHolder.getContext().authentication

        when (authentication.authorities.map { it.authority }[0]) {
            SecurityConfig.MANAGER_ROLE -> {
                accessGrantedUpdateTicketStatus(ticket, status)
                return ticket.toDTO()
            }
            SecurityConfig.EXPERT_ROLE -> {
                if(ticket.expert?.email == authentication.name){
                    accessGrantedUpdateTicketStatus(ticket, status)
                    return ticket.toDTO()
                }
                else
                    throw UnauthorizedTicketException("You can't access this ticket!")
            }
            else -> throw UnauthorizedTicketException("You can't access this ticket!")
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
                expert = ticket.expert
            )
        )
    }

    override fun updateTicketPriority(ticketId: Long, priorityValue: String): TicketDTO? {
        val ticket = getTicketById(ticketId)?.toTicket() ?: throw TicketNotFoundException("Ticket not found!")
        val priority = try {
            TicketPriority.valueOf(priorityValue.uppercase())
        } catch (e: IllegalArgumentException) {
            throw TicketPriorityInvalidException("Ticket Priority not valid!")
        }
        ticket.priority = priority
        return ticketRepository.save(ticket).toDTO()
    }

}
