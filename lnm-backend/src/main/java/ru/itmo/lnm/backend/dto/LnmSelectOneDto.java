package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LnmSelectOneDto {
    @NotNull
    @NotBlank
    private String taskId;
    @NotNull
    @NotBlank
    private String taskType;
    @NotNull
    @NotBlank
    private int actualChoice;
    @NotNull
    @NotBlank
    private int expectedChoice;
    @NotNull
    @NotBlank
    private String sessionToken;
}

