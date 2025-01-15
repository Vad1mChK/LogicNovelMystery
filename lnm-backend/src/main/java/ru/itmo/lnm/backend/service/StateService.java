package ru.itmo.lnm.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.CampaignReportDto;
import ru.itmo.lnm.backend.dto.JumpedChapterDto;
import ru.itmo.lnm.backend.dto.SessionDto;
import ru.itmo.lnm.backend.messages.CampaignReportResponse;
import ru.itmo.lnm.backend.messages.RestoreStateResponse;
import ru.itmo.lnm.backend.messages.StateResponse;
import ru.itmo.lnm.backend.model.*;
import ru.itmo.lnm.backend.repository.LeaderBoardRepository;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StateService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final LeaderBoardRepository leaderBoardRepository;

    public CampaignReportResponse campaignReport(CampaignReportDto request, String username) {
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionId(), user);
        Session partnerSession = null;
        String ending = null;
        if (session.getHero().equals(LnmHero.STEVE)) {
            ending = request.getWinner() ? "1" : "0";
        } else {
            partnerSession = sessionRepository.findBySessionTokenAndUserNot(request.getSessionId(), user);
            LnmPlayerState partnerPlayerState = partnerSession.getPlayerState();
            if (session.getHero().equals(LnmHero.PROFESSOR)) {
                if (request.getWinner()) {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "1A";
                        case WAITING_LOST -> ending = "4A";
                        case WAITING_WON -> ending = "5A";
                        default -> {
                            return null;
                        }
                    }
                } else {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "0A";
                        case WAITING_LOST -> ending = "2A";
                        case WAITING_WON -> ending = "3A";
                        default -> {
                            return null;
                        }
                    }
                }

            } else if (session.getHero().equals(LnmHero.VICKY)) {
                if (request.getWinner()) {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "1B";
                        case WAITING_LOST -> ending = "4B";
                        case WAITING_WON -> ending = "5B";
                        default -> {
                            return null;
                        }
                    }
                } else {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "0B";
                        case WAITING_LOST -> ending = "2B";
                        case WAITING_WON -> ending = "3B";
                        default -> {
                            return null;
                        }
                    }
                }
            }
        }
        changePlayerState(session, partnerSession, ending);
        return CampaignReportResponse.builder()
                .endingId(ending)
                .build();
    }

    public void changePlayerState(Session session, Session partnerSession, String ending){
        if (ending != null){
            try {
                if (ending.equals("0")) {
                    session.setPlayerState(LnmPlayerState.COMPLETED_LOST);
                    session.setGameStatus(false);
                }
                else if (ending.equals("1")) {
                    session.setPlayerState(LnmPlayerState.COMPLETED_WON);
                    session.setGameStatus(false);
                }
                else {
                    int startPart = ending.charAt(0);
                    switch (startPart) {
                        case 0 -> session.setPlayerState(LnmPlayerState.WAITING_LOST);
                        case 1 -> session.setPlayerState(LnmPlayerState.WAITING_WON);
                        case 2 -> {
                            session.setPlayerState(LnmPlayerState.COMPLETED_LOST);
                            partnerSession.setPlayerState(LnmPlayerState.COMPLETED_LOST);
                            session.setGameStatus(false);
                            partnerSession.setGameStatus(false);
                        }
                        case 3 -> {
                            session.setPlayerState(LnmPlayerState.COMPLETED_LOST);
                            partnerSession.setPlayerState(LnmPlayerState.COMPLETED_WON);
                            session.setGameStatus(false);
                            partnerSession.setGameStatus(false);
                        }
                        case 4 -> {
                            session.setPlayerState(LnmPlayerState.COMPLETED_WON);
                            partnerSession.setPlayerState(LnmPlayerState.COMPLETED_LOST);
                            session.setGameStatus(false);
                            partnerSession.setGameStatus(false);
                        }
                        case 5 -> {
                            session.setPlayerState(LnmPlayerState.COMPLETED_WON);
                            partnerSession.setPlayerState(LnmPlayerState.COMPLETED_WON);
                            session.setGameStatus(false);
                            partnerSession.setGameStatus(false);
                        }
                    }
                    sessionRepository.save(partnerSession);
                }
                sessionRepository.save(session);
            }catch (Exception e){
                System.err.println("Some exception in changePlayerState " + e);
            }
        }
    }
    public StateResponse receivePlayerState(SessionDto request, String username) {
        try {

            User user = userRepository.findByUsername(username);
            Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
            String partnerName = null;
            LnmResult result = null;
            Integer score = null;
            Integer partnerScore = null;
            Integer highScore = null;
            LnmPlayerState playerState = session.getPlayerState();
            score = session.getCurrentScore();
            if (session.getHero().equals(LnmHero.STEVE)) {
                if (playerState.equals(LnmPlayerState.COMPLETED_WON)) {
                    result = LnmResult.SINGLE_GOOD;
                    LeaderBoard leaderBoard = leaderBoardRepository.findByUserAndGameMode(user, false);
                    if (leaderBoard != null) {
                        highScore = leaderBoard.getScore();
                        System.out.println(session.getSessionToken());
                        if (score > highScore) {
                            leaderBoard.setScore(score);
                            leaderBoard.setSessionToken(session.getSessionToken());

                            leaderBoardRepository.save(leaderBoard);
                        }
                    }
                    else {
                        LeaderBoard newLeaderBoard = new LeaderBoard();
                        newLeaderBoard.setUser(user);
                        newLeaderBoard.setScore(score);
                        newLeaderBoard.setSessionToken(session.getSessionToken());
                        newLeaderBoard.setGameMode(false);
                        leaderBoardRepository.save(newLeaderBoard);
                    }
                } else if (playerState.equals(LnmPlayerState.COMPLETED_LOST)) {
                    result = LnmResult.SINGLE_BAD;
                }

            } else {
                Session partnerSession = sessionRepository.findBySessionTokenAndUserNot(request.getSessionToken(), user);
                if (partnerSession != null) {
                    partnerName = partnerSession.getUser().getUsername();
                    LnmPlayerState partnerState = partnerSession.getPlayerState();
                    partnerScore = partnerSession.getCurrentScore();
                    int sumScore = score + partnerScore;
                    if (playerState.equals(LnmPlayerState.COMPLETED_WON) && partnerState.equals(LnmPlayerState.COMPLETED_WON)) {
                        result = LnmResult.DOUBLE_GOOD;

                        List<LeaderBoard> listLeaderBoard = leaderBoardRepository.findByUsersWithSameSessionToken(user, partnerSession.getUser());

                        if (listLeaderBoard == null) {
                            LeaderBoard newLeaderBoard = new LeaderBoard();
                            newLeaderBoard.setUser(user);
                            newLeaderBoard.setScore(sumScore);
                            newLeaderBoard.setSessionToken(session.getSessionToken());
                            newLeaderBoard.setGameMode(true);
                            leaderBoardRepository.save(newLeaderBoard);
                            newLeaderBoard = new LeaderBoard();
                            newLeaderBoard.setUser(partnerSession.getUser());
                            newLeaderBoard.setScore(sumScore);
                            newLeaderBoard.setSessionToken(session.getSessionToken());
                            newLeaderBoard.setGameMode(true);
                            leaderBoardRepository.save(newLeaderBoard);
                        } else {
                            LeaderBoard leaderBoardFirst = listLeaderBoard.get(0);
                            LeaderBoard leaderBoardSecond = listLeaderBoard.get(1);

                            highScore = leaderBoardFirst.getScore();
                            if (sumScore > highScore) {
                                leaderBoardFirst.setScore(sumScore);
                                leaderBoardFirst.setSessionToken(session.getSessionToken());
                                leaderBoardSecond.setScore(sumScore);
                                leaderBoardSecond.setSessionToken(session.getSessionToken());
                                leaderBoardRepository.save(leaderBoardFirst);
                                leaderBoardRepository.save(leaderBoardSecond);
                            }
                        }
                    } else if (playerState.equals(LnmPlayerState.COMPLETED_WON) && partnerState.equals(LnmPlayerState.COMPLETED_LOST)) {
                        result = LnmResult.DOUBLE_AVERAGE;
                    } else if (playerState.equals(LnmPlayerState.COMPLETED_LOST) && partnerState.equals(LnmPlayerState.COMPLETED_LOST)) {
                        result = LnmResult.DOUBLE_BAD;
                    }
                }
            }

            return StateResponse.builder()
                    .playerState(playerState)
                    .result(result)
                    .partnerName(partnerName)
                    .score(score)
                    .highScore(highScore)
                    .build();
        }catch (Exception e){
            System.err.println("Some problem in receiveState " + e);
            return null;
        }

    }

    public boolean changeToSeenResult(SessionDto request, String username){
        boolean success = false;
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
        if (session.getPlayerState().equals(LnmPlayerState.COMPLETED_WON) ||
                session.getPlayerState().equals(LnmPlayerState.COMPLETED_LOST)){
            session.setPlayerState(LnmPlayerState.SEEN_RESULTS);
            sessionRepository.save(session);
            success = true;
        }
        return success;
    }

    public boolean changeChapter(JumpedChapterDto request, String username){
        try {
            User user = userRepository.findByUsername(username);
            Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
            session.setCurrentChapter(request.getChapter());
            sessionRepository.save(session);
        }catch (Exception e){
            System.err.println("Some problems with jpa connection " + e);
            return false;
        }

        return true;
    }

    public RestoreStateResponse restoreState(SessionDto request, String username){
        try {

            User user = userRepository.findByUsername(username);
            Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
            int userHp;
            String chapter;
            if (session.isGameStatus()) {
                if (!request.getIsMultiplayer() && session.getHero().equals(LnmHero.STEVE)
                        || request.getIsMultiplayer() && (session.getHero().equals(LnmHero.PROFESSOR)
                        || session.getHero().equals(LnmHero.VICKY))) {
                    
                    userHp = session.getUserHp();
                    chapter = session.getCurrentChapter();
                    return RestoreStateResponse.builder()
                            .userHp(userHp)
                            .chapter(chapter)
                            .build();
                }
            }
        }catch (Exception e){
            System.err.println("Some problem with jpa " + e);
            return null;
        }
        return null;

    }

}
