package ru.itmo.lnm.backend.messages;

import java.util.List;
import java.util.Map;

public class LnmTestCaseResult {
    private String input;
    private boolean success;
    private List<Map<String, String>> actualResults;
}
