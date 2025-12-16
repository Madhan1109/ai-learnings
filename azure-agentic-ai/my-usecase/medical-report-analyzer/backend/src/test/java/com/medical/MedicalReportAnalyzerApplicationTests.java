package com.medical;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Basic test to verify the Medical Report Analyzer application can start
 * and basic Spring context loading works
 */
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class MedicalReportAnalyzerApplicationTests {

    @Test
    void contextLoads() {
        // This test will pass if the Spring application context loads successfully
        // It verifies that all beans can be created and dependencies are satisfied
    }
}
