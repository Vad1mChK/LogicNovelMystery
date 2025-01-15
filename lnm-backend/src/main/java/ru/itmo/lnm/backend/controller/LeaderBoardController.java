package ru.itmo.lnm.backend.controller;

import jakarta.validation.Valid;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.lnm.backend.dto.LeaderBoardDto;
import ru.itmo.lnm.backend.messages.LnmLeaderBoardResponse;
import ru.itmo.lnm.backend.service.LeaderBoardService;

@RestController
@RequestMapping("/api")
public class LeaderBoardController {

    @Autowired
    private LeaderBoardService leaderBoardService;

    @PostMapping("/leaderboard")
    public ResponseEntity<LnmLeaderBoardResponse> handleLeaderBoard(@RequestBody @Valid LeaderBoardDto leaderBoardDto){
        var response = leaderBoardService.getLeaderBoard(leaderBoardDto);
        return ResponseEntity.ok(response);
    }
}
