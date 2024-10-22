package ru.itmo.lnm.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.itmo.lnm.backend.model.LeaderBoard;

import java.util.List;
import java.util.UUID;

@Repository
public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, UUID> {

    @Query("SELECT lb FROM LeaderBoard lb " +
            "WHERE lb.score = (SELECT MAX(lb2.score) FROM LeaderBoard lb2 " +
            "WHERE lb2.sessionToken = lb.sessionToken AND lb2.gameMode = :gameMode) " +
            "AND lb.gameMode = :gameMode")
    List<LeaderBoard> findBestScoresForEachSessionToken(@Param("gameMode") boolean gameMode);
}
