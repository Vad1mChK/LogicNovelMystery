package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LnmTaskResponse {
    private boolean isCorrect;

    private double score;
}
