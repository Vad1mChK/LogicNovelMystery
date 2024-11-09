package ru.itmo.lnm.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class LnmBackendApplication  {

    public static void main(String[] args) {
        SpringApplication.run(LnmBackendApplication.class, args);
    }


//    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
//        return application.sources(LnmBackendApplication.class);
//    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
