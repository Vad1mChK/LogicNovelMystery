package ru.itmo.lnm.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itmo.lnm.backend.dto.JwtDto;
import ru.itmo.lnm.backend.dto.RegisterUserDto;
import ru.itmo.lnm.backend.messages.JwtResponse;
import ru.itmo.lnm.backend.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterUserDto registerUserDto) {
        try {
            authService.registerUser(registerUserDto);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody @Valid JwtDto jwtDto) {
        JwtResponse jwtResponse = authService.authenticateUser(jwtDto);
        if (jwtResponse != null) {
            return ResponseEntity.ok(jwtResponse);
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }
}
