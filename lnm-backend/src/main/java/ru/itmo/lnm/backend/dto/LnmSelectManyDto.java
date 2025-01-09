package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class LnmSelectManyDto {
    @NotNull
    @NotBlank
    private String taskId;
    @NotNull
    @NotBlank
    private String taskType;
    @NotNull
    @NotBlank
    private List<Integer> actualChoices;
    @NotNull
    @NotBlank
    private List<Integer> expectedChoices;
    @NotNull
    @NotBlank
    private String sessionToken;
}

