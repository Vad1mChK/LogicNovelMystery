package ru.itmo.lnm.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    public User user;

    @Column(updatable = false, nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean gameStatus;

    @Column(nullable = false, updatable = false)
    private String sessionToken;

    private  Instant finishedAt;

    @Column(nullable = false)
    private int userHp;

    @Column(nullable = false)
    private int currentScore;

    @Column(nullable = false)
    private int currentTask;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
    }
}
