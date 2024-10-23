//package ru.itmo.lnm.backend;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.boot.builder.SpringApplicationBuilder;
//import static org.junit.jupiter.api.Assertions.*;
//
//class ServletInitializerTests {
//
//    @Test
//    void configure() {
//        ServletInitializer servletInitializer = new ServletInitializer();
//        SpringApplicationBuilder builder = new SpringApplicationBuilder();
//        SpringApplicationBuilder configuredBuilder = servletInitializer.configure(builder);
//
//        // Проверяем, что метод configure возвращает объект с источником LnmBackendApplication
//        assertTrue(configuredBuilder.sources().contains(LnmBackendApplication.class));
//    }
//}
