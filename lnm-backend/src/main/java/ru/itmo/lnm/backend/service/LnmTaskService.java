package ru.itmo.lnm.backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.LnmCompleteQueryDto;
import ru.itmo.lnm.backend.dto.LnmTestCase;
import ru.itmo.lnm.backend.dto.LnmWriteKnowledgeDto;
import ru.itmo.lnm.backend.messages.*;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.SessionRepository;
import ru.itmo.lnm.backend.repository.UserRepository;
import ru.itmo.lnm.backend.service.ScoreService;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        List<Map<String, String>> results = prologService.executeProlog(request.getKnowledge(), request.getQuery());
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
        int currentScore = session.getCurrentScore();
        int currentTask = session.getCurrentTask();
        boolean success = validateResults(results, request.getExpectedResults());

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

    public LnmTaskResponse processWriteKnowledgeTask(LnmWriteKnowledgeDto request, String username) {
        List<LnmTestCaseResult> testCaseResults = new ArrayList<>();
        User user = userRepository.findByUsername(username);
        Session session = sessionRepository.findBySessionTokenAndUser(request.getSessionToken(), user);
        int currentScore = session.getCurrentScore();
        int currentTask = session.getCurrentTask();
        boolean success = true;
        for (LnmTestCase testCase : request.getTestCases()) {
            List<Map<String, String>> actualResults = prologService.executeProlog(request.getKnowledge(), testCase.getQuery());
            success = validateResults( actualResults, testCase.getExpectedResults());
            if (!success){
                currentScore += ScoreService.scoreSolution(currentTask, 2);
                session.setCurrentTask(session.getCurrentTask() + 1);
                session.setCurrentScore(currentScore);
                break;
            }
        }

        return LnmTaskResponse.builder()
                .isCorrect(success)
                .score(currentScore)
                .build();
    }

    private boolean validateResults(List<Map<String, String>> results, List<Map<String,String>> actualResults) {
        if (results == null || actualResults == null) {
            return false;
        }

        // Сравниваем размеры списков
        if (results.size() != actualResults.size()) {
            return false;
        }
        // Сортировка списков по содержимому для упрощения сравнения
        List<Map<String, String>> sortedResults = results.stream()
                .sorted((map1, map2) -> map1.toString().compareTo(map2.toString())).toList();

        List<Map<String, String>> sortedActualResults = actualResults.stream()
                .sorted((map1, map2) -> map1.toString().compareTo(map2.toString())).toList();

        // Посрочно сравниваем элементы списков
        for (int i = 0; i < sortedResults.size(); i++) {
            Map<String, String> map1 = sortedResults.get(i);
            Map<String, String> map2 = sortedActualResults.get(i);

            if (!map1.equals(map2)) {
                return false;
            }
        }

        return true;
    }

}
