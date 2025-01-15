package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestoreStateResponse {

    private int userHp;
    private String chapter;
}
