package ru.itmo.lnm.backend.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class LnmTestCase {
    private String query;
    private List<Map<String, String>> expectedResults;
}
