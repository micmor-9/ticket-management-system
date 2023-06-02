package it.polito.wa2.g35.server

import io.micrometer.common.KeyValue
import io.micrometer.observation.Observation
import io.micrometer.observation.ObservationHandler
import io.micrometer.observation.ObservationRegistry
import io.micrometer.observation.aop.ObservedAspect
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import java.util.stream.StreamSupport

@SpringBootApplication
class ServerApplication

fun main(args: Array<String>) {
    runApplication<ServerApplication>(*args)

    @Bean
    fun observedAspect(observationRegistry: ObservationRegistry): ObservedAspect {
        return ObservedAspect(observationRegistry)
    }

    @Component
    class ObsHandler : ObservationHandler<Observation.Context> {
        private val log = LoggerFactory.getLogger(ObsHandler::class.java)
        override fun onStart(context: Observation.Context) {
            log.info(
                "Before running the observation for context [{}], userType [{}]",
                context.name
            )
        }

        override fun onStop(context: Observation.Context) {
            log.info(
                "After running the observation for context [{}], userType [{}]",
                context.name
            )
        }

        override fun supportsContext(context: Observation.Context): Boolean {
            return true
        }
    }

}






