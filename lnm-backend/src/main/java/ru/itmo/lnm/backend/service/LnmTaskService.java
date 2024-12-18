package ru.itmo.lnm.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.LnmCompleteQueryDto;
import ru.itmo.lnm.backend.dto.LnmTestCase;
import ru.itmo.lnm.backend.messages.*;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;
import ru.itmo.lnm.backend.service.ScoreService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LnmTaskService {

    @Autowired
    private PrologService prologService;

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    @Autowired
    public LnmTaskService(SessionRepository sessionRepository,
                          UserRepository userRepository){
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }
    public LnmTaskResponse processCompleteQueryTask(LnmCompleteQueryDto request, String username) {
//        List<Map<String, String>> actualResults = prologService.evaluateQuery(request.getQuery());
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
        int currentScore = session.getCurrentScore();
        int currentTask = session.getCurrentTask();
        boolean success = validateResults(request.getQuery(), request.getExpectedResults());

        if (success){
            currentScore += ScoreService.scoreSolution(currentTask, 2);
            session.setCurrentTask(session.getCurrentTask() + 1);
            session.setCurrentScore(currentScore);
        }
        else {
            session.setUserHp(session.getUserHp() - 10);
            if (session.getUserHp() <= 0){
                session.setGameStatus(false);
            }
           sessionRepository.save(session);
        }
        return LnmTaskResponse.builder()
                .isCorrect(success)
                .score(currentScore)
                .build();
    }

//    public LnmWriteKnowledgeTaskResponse processWriteKnowledgeTask(LnmWriteKnowledgeTaskRequest request) {
//        List<LnmTestCaseResult> testCaseResults = new ArrayList<>();
//
//        for (LnmTestCase testCase : request.getTestCases()) {
//            List<Map<String, String>> actualResults = prologService.evaluateQuery(testCase.getQuery());
//            boolean success = validateResults(testCase.getExpectedResults(), actualResults);
//            testCaseResults.add(new LnmTestCaseResult(testCase.getQuery(), success, actualResults));
//        }
//
//        return new LnmWriteKnowledgeResponse(
//                request.getTaskId(),
//                !testCaseResults.contains(testCase -> !testCase.isSuccess()),  // Overall success
//                testCaseResults
//        );
//    }

    private boolean validateResults(String query, String actualResults) {
        // Сравнение результатов
        return actualResults.equals(query);
    }

}
