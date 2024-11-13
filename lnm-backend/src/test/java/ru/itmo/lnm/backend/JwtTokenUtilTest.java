package ru.itmo.lnm.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.service.JwtTokenUtil;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Запускает Spring Context для теста
@ActiveProfiles("test") // Используем профиль test для подгрузки application-test.properties
class JwtTokenUtilTest {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("testUser");
        testUser.setPassword("password123");
        testUser.setEmail("testuser@example.com");
        testUser.setCreatedAt(Instant.now());
        testUser.setUpdatedAt(Instant.now());
        testUser.setOnlineTime(Instant.now());
    }

    @Test
    void testGenerateAndExtractUsername() {
        // Генерация токена для тестового пользователя
        String token = jwtTokenUtil.generateToken(testUser);

        // Извлечение имени пользователя из токена
        String extractedUsername = jwtTokenUtil.extractUsername(token);

        assertEquals("testUser", extractedUsername, "Имя пользователя должно совпадать с 'testUser'");
    }

    @Test
    void testTokenValidity() {
        // Генерация токена для тестового пользователя
        String token = jwtTokenUtil.generateToken(testUser);

        // Проверка на валидность токена
        assertTrue(jwtTokenUtil.isTokenValid(token, testUser), "Токен должен быть валиден для пользователя testUser");

        // Создание другого пользователя для проверки невалидности
        User anotherUser = new User();
        anotherUser.setId(UUID.randomUUID());
        anotherUser.setUsername("anotherUser");

        // Проверка на невалидность токена для другого пользователя
        assertFalse(jwtTokenUtil.isTokenValid(token, anotherUser), "Токен должен быть невалиден для другого пользователя");
    }
}
