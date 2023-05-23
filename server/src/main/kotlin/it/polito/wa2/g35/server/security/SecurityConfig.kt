package it.polito.wa2.g35.server.security

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.web.SecurityFilterChain
import org.springframework.stereotype.Component
import java.util.*


@Component
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true, securedEnabled = true)
class SecurityConfig() {

    @Value("\${spring.security.oauth2.resourceserver.jwt.resource-id}")
    lateinit var clientId: String

    @Value("\${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    lateinit var issuerUri: String

    companion object {
        const val MANAGER_ROLE = "ROLE_Manager"
        const val CLIENT_ROLE = "ROLE_Client"
        const val EXPERT_ROLE = "ROLE_Expert"
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.csrf().disable()
        http.authorizeHttpRequests()
            .requestMatchers(HttpMethod.POST, "/login/").permitAll()
            .requestMatchers(HttpMethod.POST, "/profiles/").permitAll()
            .anyRequest().authenticated()
        http.oauth2ResourceServer()
            .jwt()
            .jwtAuthenticationConverter(jwtAuthenticationConverter())
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        return http.build()
    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        return JwtDecoders.fromOidcIssuerLocation(issuerUri)
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setPrincipalClaimName("email")
        converter.setJwtGrantedAuthoritiesConverter { jwt: Jwt ->
            val resourceAccess = jwt.getClaim<Map<String, Any>>("resource_access")
            val client = resourceAccess[clientId] as Map<*, *>
            val roles = client.get("roles") as? Collection<*>
            roles?.map { SimpleGrantedAuthority("ROLE_$it") }?.toSet()
        }
        return converter
    }
}