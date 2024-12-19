package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class LnmWriteKnowledgeDto {
    @NotNull
    @NotBlank
    private String taskId;
    @NotNull
    @NotBlank
    private String taskType;
    @NotNull
    @NotBlank
    private String sessionToken;

    @NotNull
    @NotBlank
    private List<String> knowledge;
    @NotNull
    @NotBlank
    private List<LnmTestCase> testCases;
}
