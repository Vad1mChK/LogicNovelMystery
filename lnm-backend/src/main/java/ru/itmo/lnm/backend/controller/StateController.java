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
import ru.itmo.lnm.backend.messages.CampaignReportResponse;
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
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(CampaignReportResponse.builder()
                        .endingId(null)
                        .build());
            }
        } catch (Exception e) {
            System.err.println("Error processing campaign report " + e);

            // Возврат ответа с ошибкой
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CampaignReportResponse.builder()
                            .endingId(null)
                            .build());
        }

    }
}
