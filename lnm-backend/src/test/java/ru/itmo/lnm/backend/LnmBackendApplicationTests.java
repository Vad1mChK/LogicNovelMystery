package ru.itmo.lnm.backend;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.testcontainers.utility.TestcontainersConfiguration;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
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
