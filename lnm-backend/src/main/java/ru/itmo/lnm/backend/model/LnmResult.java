package ru.itmo.lnm.backend.model;

public enum LnmResult {
        SINGLE_BAD, // 1P lose
        SINGLE_GOOD, // 1P win
        DOUBLE_BAD, // 2P both lose
        DOUBLE_AVERAGE, // 2P one loses one wins
        DOUBLE_GOOD     // 2P both win
}
