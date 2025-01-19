package ru.itmo.lnm.backend.model;

public enum LnmPlayerState {
    CREATED,         // Player created a lobby and is waiting for a partner
    PLAYING,         // Player is actively playing the game
    WAITING_WON,     // Player has won and is waiting for partner
    WAITING_LOST,    // Player has lost and is waiting for partner
    COMPLETED_WON,   // Both players have completed, player won
    COMPLETED_LOST,  // Both players have completed, player lost
    SEEN_RESULTS,    // Player has viewed the results
}
