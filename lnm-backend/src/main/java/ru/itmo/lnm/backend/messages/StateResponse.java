package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;
import ru.itmo.lnm.backend.model.LnmPlayerState;

@Data
@Builder
public class StateResponse {
    private LnmPlayerState playerState;
}
