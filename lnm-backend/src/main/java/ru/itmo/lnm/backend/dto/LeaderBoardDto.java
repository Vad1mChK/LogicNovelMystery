package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeaderBoardDto {
    @NotNull
    private boolean isMultiplayer;
}
