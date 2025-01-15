package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;
import ru.itmo.lnm.backend.model.LnmLeaderBoard;

import java.util.List;

@Data
@Builder
public class LnmLeaderBoardResponse {
    private List<LnmLeaderBoard> leaderBoardList;
}
