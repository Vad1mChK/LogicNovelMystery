package ru.itmo.lnm.backend.messages;

import java.util.List;

public class LnmWriteKnowledgeResponse {
    private String taskType;
    private List<LnmTestCaseResult> testCaseResults;
}
