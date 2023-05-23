# API

## Ticket

### GET

#### /tickets
RequestBody: empty
Response: 200 OK, 401 Unauthorized, 500 Internal Server Error 
ResponseBody : Ticket[]

Ottieni tutti i ticket in qualsiasi stato essi siano.
Operazione permessa solo al Manager

#### /ticket/:idTicket
RequestParam: idTicket : number
RequestBody: empty
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody: Ticket

Accessibile da:
- manager
- customer se è un suo ticket
- expert se il ticket è attualmente assegnato a lui

#### /ticket/:status
RequestParam: status : string
RequestBody: empty
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody : Ticket[]

Accessibile da:
- manager
- customer
- expert

#### /ticket/:idExpert
RequestParam: idExpert : number
RequestBody: empty
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody : Ticket[]

Accessibile da:
- manager
- expert (se idExpert è il suo)

#### /ticket/:idCustomer
RequestParam: idCustomer : number
RequestBody: empty
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody : Ticket[]

Accessibile da:
- manager
- expert (se idExpert è il suo)

#### /ticket/:priority
RequestParam: priority : number
RequestBody: empty
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody : Ticket[]

Accessibile da:
- manager
- expert

### POST

#### /ticket
RequestBody : TicketDTO \
Response: 201 Created, 401 Unauthorized, 422 Bad Request, 500 Server Error
ResponseBody : empty

Lo stato del Ticket è OPEN, solo un Customer può eseguire quest'azione

Service : createTicket, bisogna controllare che l'ordine di questo prodotto per il customer esista e che la garanzia sia ancora valida
Contestualmente viene creato un nuovo record in TicketStatus relativo al nuovo Ticket con status OPEN

### PUT

#### /ticket/:ticketId
RequestBody : TicketDTO \
Response: 200 OK, 401 Unauthorized, 422 Bad Request, 500 Server Error
ResponseBody : empty

Aggiornando un ticket viene aggiornato lo (status, priorità, idExpert) e contestualmente viene inserito un nuovo record in TicketStatus con il nuovo status
Nel service, ogni passaggio di stato viene gestito separatamente

## Message

### GET

#### /message/:ticketId

Get messages related to ticketId

RequestBody: Empty
Response: 200 OK, 401 Unauthorized, 500 Internal Server Error
ResponseBody : Message[]

### POST

#### /message
Create a new message

RequestBody : MessageDTO \
Response: 201 Created, 422 Bad Request, 500 Server Error, 401 Unauthorized
ResponseBody: empty

## TicketStatus

### POST

#### /status/:ticketId

RequestBody: TicketStatusDTO \
Constraints: se status == OPEN, solo Manager può impostare IN PROGRESS

## Attachment

### POST 

#### /attachment
Create a new attachment

RequestBody: Attachment
Response: 201 Created, 422 Bad Request, 500 Server Error, 401 Unauthorized
ResponseBody: empty

### GET

#### /attachment/:idAttachment
Get a attachment with the given id

RequestBody: empty
RequestParam: idAttachment
Response: 200 OK, 422 Bad Request, 500 Server Error, 401 Unauthorized
ResponseBody: empty


## ORDER

### GET

#### /orders/:customerId
Return the list of customer's orders

RequestBody: Empty
Response: 200 OK, 422 Bad Request, 500 Server Error, 401 Unauthorize, 404 Not Found

#### /orders/:customerId/:productId
Return the order associated to a customer and a product

RequestBody: Empty
Response: 200 OK, 422 Bad Request, 500 Server Error, 401 Unauthorize, 404 Not Found


#### /order
Return the order associated to a customer

RequestBody: 

## EXPERT

### GET

#### /experts

Return list of experts

RequestBody: empty
RequestParam: empty
Response: 200 OK, 401 Unauthorized, 500 Internal Server Error
ResponseBody: ExpertDTO[]

#### /expert/:specialization

List of experts by specialization

RequestBody: empty
RequestParam: specialization: String
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody: ExpertDTO[]

#### /expert/:expertId

Get Expert By Id

RequestBody: empty
RequestParam: expertId: String
Response: 200 OK, 404 Not Found, 401 Unauthorized, 500 Internal Server Error
ResponseBody: ExpertDTO
