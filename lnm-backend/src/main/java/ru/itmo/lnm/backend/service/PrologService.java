package ru.itmo.lnm.backend.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.engine.PrologEngine;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrologService {

    private final PrologEngine prologEngine;


    public List<Map<String, String>> executeProlog(List<String> knowledge, String query) {
        // Load the knowledge into the Prolog engine
        prologEngine.clear();
        prologEngine.loadKnowledge(knowledge);

        // Execute the query
        List<Map<String, String>> results = prologEngine.runQuery(query);

        return results;
    }

}
