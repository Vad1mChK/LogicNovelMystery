package ru.itmo.lnm.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CampaignReportDto {
    @NotNull
    private String sessionId;

    @NotNull
    private Boolean winner;
}
