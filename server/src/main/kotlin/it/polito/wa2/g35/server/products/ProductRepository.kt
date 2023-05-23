package it.polito.wa2.g35.server.products

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
// marker interface, gives hints to the framework about the content of the file

// capable of interacting with a database
@Repository
interface ProductRepository: JpaRepository<Product, String>