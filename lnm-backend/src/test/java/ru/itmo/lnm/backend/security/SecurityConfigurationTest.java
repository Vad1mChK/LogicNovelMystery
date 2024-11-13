package ru.itmo.lnm.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.DefaultSecurityFilterChain;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ru.itmo.lnm.backend.security.JwtTokenFilter;
import ru.itmo.lnm.backend.security.SecurityConfiguration;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@EnableWebSecurity
class SecurityConfigurationTest {

    @InjectMocks
    private SecurityConfiguration securityConfiguration;

    @Mock
    private JwtTokenFilter jwtTokenFilter;

    @Mock
    private HttpSecurity httpSecurity;  // Изменено на Mock

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);

        // Настройка поведения для httpSecurity
        when(httpSecurity.csrf(any())).thenReturn(httpSecurity);
        when(httpSecurity.cors(any())).thenReturn(httpSecurity);
        when(httpSecurity.httpBasic(any())).thenReturn(httpSecurity);
        when(httpSecurity.sessionManagement(any())).thenReturn(httpSecurity);
        when(httpSecurity.exceptionHandling(any())).thenReturn(httpSecurity);
        when(httpSecurity.authorizeHttpRequests(any())).thenReturn(httpSecurity);
        when(httpSecurity.anonymous(any())).thenReturn(httpSecurity);
        when(httpSecurity.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)).thenReturn(httpSecurity);
        when(httpSecurity.build()).thenReturn(Mockito.<DefaultSecurityFilterChain>mock(String.valueOf(SecurityFilterChain.class)));
    }

    @Test
    void testSecurityFilterChain() throws Exception {
        SecurityFilterChain securityFilterChain = securityConfiguration.securityFilterChain(httpSecurity);

        // Проверка, что цепочка фильтров не пуста
        assertNotNull(securityFilterChain);

        // Проверка, что JWT фильтр добавлен
        verify(httpSecurity, times(1)).addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
}