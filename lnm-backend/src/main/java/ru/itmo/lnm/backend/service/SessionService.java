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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SessionService {
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    public ResponseEntity<String> createSession(SessionDto sessionDto, String username){
        User user = userRepository.findByUsername(username);
        Session session = new Session();
        session.setUser(user);
        if (sessionDto.getIsMultiplayer()){
            Session partnerSession = sessionRepository.findBySessionToken(sessionDto.getSessionToken());
            if (partnerSession != null && !partnerSession.getUser().equals(user)) {
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

        }
        session.setSessionToken(sessionDto.getSessionToken());
        session.setCurrentScore(0);
        session.setCurrentTask(1);
        session.setUserHp(100);
        session.setGameStatus(true);
        session.setCurrentChapter("inception1");
        sessionRepository.save(session);

        return new ResponseEntity<>("Successful", HttpStatus.CREATED);

    }
    public LnmSessionListResponse getWaitingSession(String username){
        User user = userRepository.findByUsername(username);
        List<Session> lnmSessionList = sessionRepository.findAllByPlayerStateAndGameStatusAndUserNot(LnmPlayerState.CREATED, true, user);
        Map<String, String> waitingRooms = new HashMap<>();
        for (Session lnmSession : lnmSessionList){
            waitingRooms.put(lnmSession.getUser().getUsername(), lnmSession.getSessionToken());
        }
        return LnmSessionListResponse.builder()
                .sessionList(waitingRooms)
                .build();
    }

}
