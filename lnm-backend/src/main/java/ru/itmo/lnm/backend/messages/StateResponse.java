package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;
import ru.itmo.lnm.backend.model.LnmPlayerState;
import ru.itmo.lnm.backend.model.LnmResult;

@Data
@Builder
public class StateResponse {
    private LnmPlayerState playerState;
    private LnmResult result;
    private String partnerName;
    private Integer score;
    private Integer highScore;
}
