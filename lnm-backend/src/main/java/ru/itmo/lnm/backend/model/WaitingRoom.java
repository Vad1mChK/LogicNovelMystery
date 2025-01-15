package ru.itmo.lnm.backend.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WaitingRoom {
    private String username;
    private String sessionToken;
}
