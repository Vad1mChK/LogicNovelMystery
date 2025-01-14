package ru.itmo.lnm.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.lnm.backend.model.LnmPlayerState;
import ru.itmo.lnm.backend.model.Session;
import ru.itmo.lnm.backend.model.User;

import java.util.List;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {
    Session findBySessionTokenAndUser(String sessionToken, User user);
    Boolean existsBySessionToken(String sessionToken);

    LnmPlayerState findBySessionTokenAndUserNot(String sessionToken, User user);

}
