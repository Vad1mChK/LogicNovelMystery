package ru.itmo.lnm.backend.engine;

import java.util.List;
import java.util.Map;

public interface PrologEngine {
    void clear();
    void loadKnowledge(List<String> knowledge);
    List<Map<String, String>> runQuery(String query);
}
