package ru.itmo.lnm.backend.controller;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
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
        var response = stateService.campaignReport(campaignReportDto, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
