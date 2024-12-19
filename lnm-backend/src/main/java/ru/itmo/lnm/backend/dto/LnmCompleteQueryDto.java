package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class LnmCompleteQueryDto {

    @NotNull
    @NotBlank
    private String taskId;
    @NotNull
    @NotBlank
    private String taskType;
    @NotNull
    @NotBlank
    private List<String> knowledge;

    @NotNull
    @NotBlank
    private String sessionToken;

    @NotNull
    @NotBlank
    private String query;
    @NotNull
    @NotBlank
    private List<Map<String, String>>  expectedResults;
}
