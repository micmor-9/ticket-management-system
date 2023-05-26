import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.0.5"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
    kotlin("plugin.jpa") version "1.7.22"
    id("com.google.cloud.tools.jib") version "3.3.1"
}

group = "it.polito.wa2.g35"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.hibernate.validator:hibernate-validator")
    implementation("com.github.houbb:hibernator-valid:1.0.0")
    runtimeOnly("org.postgresql:postgresql")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.apache.httpcomponents:httpclient")
    testImplementation ("org.testcontainers:junit-jupiter:1.16.3")
    testImplementation("org.testcontainers:postgresql:1.16.3")
    testImplementation("org.junit.jupiter:junit-jupiter-params")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.security:spring-security-oauth2-resource-server:6.0.3")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    implementation("org.springframework.security:spring-security-oauth2-jose")
    implementation("org.keycloak:keycloak-admin-client:15.0.2")
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

dependencyManagement {
    imports {
        mavenBom("org.testcontainers:testcontainers-bom:1.16.3")
    }
}

jib {
    to {
        image ="lab05-server:latest"
    }
}
