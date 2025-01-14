package ru.itmo.lnm.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.itmo.lnm.backend.model.LeaderBoard;
import ru.itmo.lnm.backend.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeaderBoardRepository extends JpaRepository<LeaderBoard, UUID> {

    @Query("SELECT lb FROM LeaderBoard lb " +
            "WHERE lb.score = (SELECT MAX(lb2.score) FROM LeaderBoard lb2 " +
            "WHERE lb2.sessionToken = lb.sessionToken AND lb2.gameMode = :gameMode) ")
    List<LeaderBoard> findBestScoresForEachSessionToken(@Param("gameMode") boolean gameMode);

    LeaderBoard findByUserAndGameMode(User user, boolean gameMode);

    @Query("SELECT l FROM LeaderBoard l WHERE l.sessionToken IN " +
            "(SELECT l2.sessionToken FROM LeaderBoard l2 WHERE l2.user = :user1) " +
            "AND l.user = :user2")
    List<LeaderBoard> findByUsersWithSameSessionToken(@Param("user1") User user1, @Param("user2") User user2);

}
