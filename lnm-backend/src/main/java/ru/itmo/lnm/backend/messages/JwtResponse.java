package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JwtResponse {

    private String token;

    private long expiresIn;

}
