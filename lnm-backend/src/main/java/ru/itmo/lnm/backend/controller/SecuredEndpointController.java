package ru.itmo.lnm.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/secured-endpoint")
public class SecuredEndpointController {

    @GetMapping
    public ResponseEntity<String> getSecuredData() {
        return ResponseEntity.ok("This is secured data");
    }
}
