package ru.itmo.lnm.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
public class SessionRepositoryTest {
    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        // Создание тестового пользователя
        testUser = new User();
        testUser.setUsername("testUser");
        testUser.setPassword("password123");
        testUser.setEmail("test@example.com");
        testUser.setOnlineTime(Instant.now());
        userRepository.save(testUser);
    }

    @Test
    public void testCreateSession() {
        // Создание новой сессии
        Session session = new Session();
        session.setUser(testUser);
        session.setSessionToken("testToken");
        session.setGameStatus(true);
        session.setUserHp(100);
        session.setCurrentScore(0);
        sessionRepository.save(session);

        // Проверка, что сессия была успешно сохранена
        assertThat(session.getId()).isNotNull();
        assertThat(session.getCreatedAt()).isNotNull();
        assertThat(session.getUser()).isEqualTo(testUser);
    }

    @Test
    public void testFindBySessionTokenAndUserId() {
        // Создаем сессию
        Session session = new Session();
        session.setUser(testUser);
        session.setSessionToken("testToken");
        session.setGameStatus(true);
        session.setUserHp(100);
        session.setCurrentScore(0);
        sessionRepository.save(session);

        // Ищем сессию по токену и пользователю
        Session foundSession = sessionRepository.findBySessionTokenAndUserId("testToken", testUser.getId());

        // Проверка, что сессия найдена
        assertThat(foundSession).isNotNull();
        assertThat(foundSession.getSessionToken()).isEqualTo("testToken");
    }

    @Test
    public void testUpdateSession() {
        // Создаем сессию
        Session session = new Session();
        session.setUser(testUser);
        session.setSessionToken("testToken");
        session.setGameStatus(true);
        session.setUserHp(100);
        session.setCurrentScore(0);
        sessionRepository.save(session);

        // Обновляем сессию
        session.setCurrentScore(10);
        sessionRepository.save(session);

        // Проверяем, что изменения сохранились
        Session updatedSession = sessionRepository.findById(session.getId()).orElse(null);
        assertThat(updatedSession).isNotNull();
        assertThat(updatedSession.getCurrentScore()).isEqualTo(10);
    }

    @Test
    public void testFinishedAt() {
        // Создаем сессию
        Session session = new Session();
        session.setUser(testUser);
        session.setSessionToken("testToken");
        session.setGameStatus(true);
        session.setUserHp(100);
        session.setCurrentScore(0);
        sessionRepository.save(session);

        // Устанавливаем время завершения
        Instant finishedAt = Instant.now();
        session.setFinishedAt(finishedAt);
        sessionRepository.save(session);

        // Проверяем, что время завершения установлено
        Session savedSession = sessionRepository.findById(session.getId()).orElse(null);
        assertThat(savedSession).isNotNull();
        assertTrue(Math.abs(savedSession.getFinishedAt().toEpochMilli() - finishedAt.toEpochMilli()) < 1000);
    }
}
