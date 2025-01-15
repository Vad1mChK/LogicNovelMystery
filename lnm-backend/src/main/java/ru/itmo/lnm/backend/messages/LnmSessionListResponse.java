package ru.itmo.lnm.backend.messages;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class LnmSessionListResponse {
    private Map<String , String> sessionList;
}
