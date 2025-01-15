package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;
import ru.itmo.lnm.backend.model.WaitingRoom;

import java.util.List;

@Data
@Builder
public class LnmSessionListResponse {
    private List<WaitingRoom> sessionList;
}
