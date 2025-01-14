package ru.itmo.lnm.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.CampaignReportDto;
import ru.itmo.lnm.backend.messages.CampaignReportResponse;
import ru.itmo.lnm.backend.model.LnmHero;
import ru.itmo.lnm.backend.model.LnmPlayerState;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class StateService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public CampaignReportResponse campaignReport(CampaignReportDto request, String username) {
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionId(), user);
        String ending = "";
        if (session.getHero().equals(LnmHero.STEVE)) {
            ending = request.isWinner() ? "1" : "0";
        } else {
            LnmPlayerState playerState = session.getPlayerState();
            LnmPlayerState partnerPlayerState = sessionRepository.findBySessionTokenAndUserNot(request.getSessionId(), user);
            if (session.getHero().equals(LnmHero.PROFESSOR)) {
                if (request.isWinner()) {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "1A";
                        case WAITING_LOST -> ending = "4A";
                        case WAITING_WON -> ending = "5A";
                        default -> {
                        }
                    }
                } else {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "0A";
                        case WAITING_LOST -> ending = "2A";
                        case WAITING_WON -> ending = "3A";
                    }
                }

            } else if (session.getHero().equals(LnmHero.VICKY)) {
                if (request.isWinner()) {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "1B";
                        case WAITING_LOST -> ending = "4B";
                        case WAITING_WON -> ending = "5B";
                        default -> {
                        }
                    }
                } else {
                    switch (partnerPlayerState) {
                        case PLAYING -> ending = "0B";
                        case WAITING_LOST -> ending = "2B";
                        case WAITING_WON -> ending = "3B";
                    }
                }
            }
        }
        return CampaignReportResponse.builder()
                .endingId(ending)
                .build();
    }

}
