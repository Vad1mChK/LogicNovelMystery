package ru.itmo.lnm.backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.UserRepository;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@ActiveProfiles("test")
public class UserRepositoryTest {
    @Autowired
    private UserRepository userRepository;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User();
        user.setUsername("test_user");
        user.setPassword("password123");
        user.setEmail("test_user@example.com");
        user.setOnlineTime(Instant.now());
    }

    @Test
    void testUserCreation() {
        // Сохраняем пользователя
        User savedUser = userRepository.save(user);

        // Проверяем, что у пользователя есть ID
        assertNotNull(savedUser.getId(), "User ID should be generated");

        // Проверяем, что поля 'createdAt' и 'updatedAt' установлены корректно
        assertNotNull(savedUser.getCreatedAt(), "CreatedAt should not be null");
        assertNotNull(savedUser.getUpdatedAt(), "UpdatedAt should not be null");

        // Проверяем, что 'createdAt' и 'updatedAt' совпадают после создания
        assertEquals(savedUser.getCreatedAt(), savedUser.getUpdatedAt(), "CreatedAt and UpdatedAt should be equal upon creation");

        // Проверяем поле email
        assertEquals("test_user@example.com", savedUser.getEmail());
    }

    @Test
    void testUserUpdate() throws InterruptedException {
        // Сохраняем пользователя
        User savedUser = userRepository.save(user);

        // Ждем некоторое время перед обновлением
        Instant beforeUpdate = savedUser.getUpdatedAt();
        Thread.sleep(2000);
        // Обновляем время онлайн активности и сохраняем
        savedUser.setOnlineTime(Instant.now());
        userRepository.save(savedUser);
        User updatedUser = userRepository.findById(savedUser.getId()).orElseThrow();
        // Проверяем, что 'updatedAt' изменилось после обновления
        assertNotEquals(beforeUpdate, updatedUser.getUpdatedAt(), "UpdatedAt should change after update");

        // Проверяем, что время 'onlineTime' обновилось
        assertNotNull(savedUser.getOnlineTime(), "OnlineTime should be updated");
        assertTrue(updatedUser.getUpdatedAt().isAfter(beforeUpdate), "UpdatedAt should be after the previous one");
    }

    @Test
    void testFindByUsername() {
        // Сохраняем пользователя
        userRepository.save(user);

        // Ищем пользователя по username
        User foundUser = userRepository.findByUsername("test_user");

        // Проверяем, что найденный пользователь не null
        assertNotNull(foundUser, "User should be found by username");
        assertEquals("test_user", foundUser.getUsername(), "Username should match");
    }

    @Test
    void testExistsUserByUsername() {
        // Проверяем, что пользователя с username нет в базе
        boolean existsBefore = userRepository.existsUserByUsername("userg");
        assertFalse(existsBefore, "User should not exist before saving");

        // Сохраняем пользователя
        userRepository.save(user);

        // Проверяем, что пользователь существует
        boolean existsAfter = userRepository.existsUserByUsername("test_user");
        assertTrue(existsAfter, "User should exist after saving");
    }
}
