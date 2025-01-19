package ru.itmo.lnm.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.LeaderBoardDto;
import ru.itmo.lnm.backend.messages.LnmLeaderBoardResponse;
import ru.itmo.lnm.backend.model.LeaderBoard;
import ru.itmo.lnm.backend.model.LnmLeaderBoard;
import ru.itmo.lnm.backend.repository.LeaderBoardRepository;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderBoardService {

    private final LeaderBoardRepository leaderBoardRepository;

    public LnmLeaderBoardResponse getLeaderBoard(LeaderBoardDto request){
            List<LeaderBoard> leaderBoardList = leaderBoardRepository.findAllByGameMode(request.getIsMultiplayer());
            List<LnmLeaderBoard> lnmLeaderBoards = parseLeaderBoard(leaderBoardList);
            return LnmLeaderBoardResponse.builder()
                    .leaderBoardList(lnmLeaderBoards)
                    .build();
    }

    private List<LnmLeaderBoard> parseLeaderBoard(List<LeaderBoard> leaderBoardList){
        List<LnmLeaderBoard> lnmLeaderBoards = new ArrayList<>();
        for (LeaderBoard leaderBoard : leaderBoardList){
            lnmLeaderBoards.add(LnmLeaderBoard.builder()
                    .score(leaderBoard.getScore())
                    .username(leaderBoard.getUser().getUsername())
                    .sessionToken(leaderBoard.getSessionToken())
                    .build());
        }
        return lnmLeaderBoards;
    }
}
