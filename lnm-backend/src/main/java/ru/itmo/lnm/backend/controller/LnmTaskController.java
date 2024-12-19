package ru.itmo.lnm.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.itmo.lnm.backend.dto.LnmCompleteQueryDto;
import ru.itmo.lnm.backend.dto.LnmWriteKnowledgeDto;
import ru.itmo.lnm.backend.messages.LnmTaskResponse;
import ru.itmo.lnm.backend.messages.LnmWriteKnowledgeResponse;
import ru.itmo.lnm.backend.service.LnmTaskService;

@RestController
@RequestMapping("/task")
public class LnmTaskController {

    @Autowired
    private LnmTaskService lnmTaskService;

    @PostMapping("/complete-query")
    public ResponseEntity<LnmTaskResponse> handleCompleteQueryTask(
            @RequestBody LnmCompleteQueryDto request,
             Authentication authorization) {
        LnmTaskResponse response = lnmTaskService.processCompleteQueryTask(request, authorization.getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/write-knowledge")
    public ResponseEntity<LnmTaskResponse> handleWriteKnowledgeTask(
            @RequestBody LnmWriteKnowledgeDto request, Authentication authentication) {
        LnmTaskResponse response = lnmTaskService.processWriteKnowledgeTask(request, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
