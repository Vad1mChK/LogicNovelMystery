package ru.itmo.lnm.backend.service;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.SessionDto;
import ru.itmo.lnm.backend.messages.LnmSessionListResponse;
import ru.itmo.lnm.backend.model.*;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    public ResponseEntity<String> createSession(SessionDto sessionDto, String username){
        User user = userRepository.findByUsername(username);
        Session session = new Session();
        session.setUser(user);
        if (sessionDto.isMultiplayer()){
            if (sessionRepository.existsBySessionToken(sessionDto.getSessionToken())){
                Session partnerSession = sessionRepository.findBySessionTokenAndUserNot(
                        session.getSessionToken(), user);
                session.setHero(LnmHero.VICKY);
                session.setPlayerState(LnmPlayerState.PLAYING);
                partnerSession.setPlayerState(LnmPlayerState.PLAYING);
                sessionRepository.save(partnerSession);
            }
            else {
                session.setHero(LnmHero.PROFESSOR);
                session.setPlayerState(LnmPlayerState.CREATED);
            }
        }
        else {
            session.setPlayerState(LnmPlayerState.PLAYING);
            session.setHero(LnmHero.STEVE);
            session.setSessionToken(sessionDto.getSessionToken());
        }
        session.setCurrentScore(0);
        session.setCurrentTask(1);
        session.setUserHp(100);
        session.setGameStatus(true);
        sessionRepository.save(session);

        return new ResponseEntity<>("Successful", HttpStatus.CREATED);

    }
    public LnmSessionListResponse getWaitingSession(){
        List<Session> lnmSessionList = sessionRepository.findAllByPlayerStateAndGameStatus(LnmPlayerState.CREATED, true);
        List<WaitingRoom> waitingRooms = new ArrayList<>();
        for (Session lnmSession : lnmSessionList){
            waitingRooms.add(WaitingRoom.builder()
                            .username(lnmSession.getUser().getUsername())
                            .sessionToken(lnmSession.getSessionToken())
                    .build());
        }
        return LnmSessionListResponse.builder()
                .sessionList(waitingRooms)
                .build();
    }

}
