package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SessionDto {
    @NotNull
    private String sessionToken;
}
