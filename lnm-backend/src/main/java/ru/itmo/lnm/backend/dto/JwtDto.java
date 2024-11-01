package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class JwtDto {

    @NotNull
    private String username;

    @NotNull
    private String password;

}
