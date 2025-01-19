package ru.itmo.lnm.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.lnm.backend.dto.CampaignReportDto;
import ru.itmo.lnm.backend.dto.JumpedChapterDto;
import ru.itmo.lnm.backend.dto.SessionDto;
import ru.itmo.lnm.backend.messages.CampaignReportResponse;
import ru.itmo.lnm.backend.messages.RestoreStateResponse;
import ru.itmo.lnm.backend.messages.StateResponse;
import ru.itmo.lnm.backend.service.StateService;

@RestController
@RequestMapping("/game")
public class StateController {

    @Autowired
    private StateService stateService;

    @PostMapping("/report-campaign")
    public ResponseEntity<CampaignReportResponse> handleCampaignReport(@RequestBody @Valid CampaignReportDto campaignReportDto,
                                                                       Authentication authentication){
        try {
            var response = stateService.campaignReport(campaignReportDto, authentication.getName());

            // Проверка успешности ответа
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            System.err.println("Error processing campaign report " + e);

            // Возврат ответа с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/player-state")
    public ResponseEntity<StateResponse> handlePlayerState(@RequestBody @Valid SessionDto sessionDto,
                                                           Authentication authentication) {
        var response = stateService.receivePlayerState(sessionDto, authentication.getName());
        if (response != null) {
            return ResponseEntity.ok(response);
        }
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @PostMapping("/seen-results")
    public ResponseEntity<String> handleSeenResults(@RequestBody @Valid SessionDto sessionDto, Authentication authentication){
        boolean success = stateService.changeToSeenResult(sessionDto, authentication.getName());
        if (success){
            return ResponseEntity.ok("Successful");
        }
        return ResponseEntity.status(HttpStatus.I_AM_A_TEAPOT).build();
    }

    @PostMapping("/jumped-chapter")
    public ResponseEntity<String> handleJumpChapter(@RequestBody @Valid JumpedChapterDto jumpedChapterDto,
                                                    Authentication authentication){
        boolean success = stateService.changeChapter(jumpedChapterDto, authentication.getName());
        if (success){
            return ResponseEntity.ok("Successful change chapter");
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/restore-state")
    public ResponseEntity<RestoreStateResponse> handleRestoreState(@RequestBody @Valid SessionDto sessionDto,
                                                                   Authentication authentication){
        var response = stateService.restoreState(sessionDto, authentication.getName());
        if (response != null){
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
