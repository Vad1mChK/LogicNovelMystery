package ru.itmo.lnm.backend.controller;


import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.lnm.backend.dto.JwtDto;
import ru.itmo.lnm.backend.dto.SessionDto;
import ru.itmo.lnm.backend.messages.JwtResponse;
import ru.itmo.lnm.backend.service.SessionService;

@RestController
@RequestMapping("/session")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @PostMapping
    public ResponseEntity<String> createSession(@RequestBody @Valid SessionDto sessionDto, Authentication authentication) {
        var response = sessionService.createSession(sessionDto, authentication.getName());
        return response;
    }
}
