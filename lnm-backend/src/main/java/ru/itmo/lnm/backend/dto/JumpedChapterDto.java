package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JumpedChapterDto {
    @NotNull
    private String sessionToken;
    @NotNull
    private String chapter;
}
