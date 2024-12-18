package ru.itmo.lnm.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class LnmWriteKnowledgeDto {
    private String taskId;
    private String taskType;
    private List<String> knowledge;
    private List<LnmTestCase> testCases;
}
