package ru.itmo.lnm.backend;
import org.springframework.boot.SpringApplication;
public class TestLnmBackendApplication {
    public static void main(String[] args) {
        SpringApplication.from(LnmBackendApplication::main).with(TestcontainersConfiguration.class).run(args);
    }
}