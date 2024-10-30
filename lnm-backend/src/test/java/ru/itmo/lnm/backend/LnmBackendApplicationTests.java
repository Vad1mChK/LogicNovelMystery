package ru.itmo.lnm.backend;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.utility.TestcontainersConfiguration;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;


@SpringBootTest
@ActiveProfiles("test")
class LnmBackendApplicationTests {
    @Test
    void contextLoads() {
    }
    @Test
    void testMain() {
        // Проверяет, что метод main выполняется без ошибок
        assertDoesNotThrow(() -> LnmBackendApplication.main(new String[] {}));
    }
}
