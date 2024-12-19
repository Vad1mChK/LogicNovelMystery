package ru.itmo.lnm.backend.service;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.SessionDto;
import ru.itmo.lnm.backend.messages.JwtResponse;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.Token;
import ru.itmo.lnm.backend.model.TokenType;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.TokenRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

@Service
public class SessionService {
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final TokenRepository tokenRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public SessionService(UserRepository userRepository,
                          SessionRepository sessionRepository,
                          TokenRepository tokenRepository,
                          JwtTokenUtil jwtTokenUtil){
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.tokenRepository = tokenRepository;
        this.jwtTokenUtil = jwtTokenUtil;
    }
    public ResponseEntity<String> createSession(SessionDto sessionDto, String username){
        User user = userRepository.findByUsername(username);
        Session session = new Session();
        session.setUser(user);
        session.setSessionToken(sessionDto.getSessionToken());
        session.setCurrentScore(0);
        session.setCurrentTask(1);
        session.setUserHp(100);
        session.setGameStatus(true);
        sessionRepository.save(session);

        return new ResponseEntity<>("Successful", HttpStatus.CREATED);



    }
}
