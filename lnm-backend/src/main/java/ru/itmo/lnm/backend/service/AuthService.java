package ru.itmo.lnm.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.itmo.lnm.backend.dto.JwtDto;
import ru.itmo.lnm.backend.dto.RegisterUserDto;
import ru.itmo.lnm.backend.messages.JwtResponse;
import ru.itmo.lnm.backend.model.Token;
import ru.itmo.lnm.backend.model.TokenType;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.repository.TokenRepository;
import ru.itmo.lnm.backend.repository.UserRepository;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;



    public void registerUser(RegisterUserDto registerUserDto) {
        if (userRepository.existsUserByUsername(registerUserDto.getName())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = User.builder()
                .username(registerUserDto.getName())
                .email(registerUserDto.getEmail())
                .password(passwordEncoder.encode(registerUserDto.getPassword()))
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .onlineTime(Instant.now())

                .build();

        userRepository.save(user);
    }


    public JwtResponse authenticateUser(JwtDto jwtDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        jwtDto.getUsername(),
                        jwtDto.getPassword()
                )
        );
        User user = userRepository.findByUsername(jwtDto.getUsername());
        if (user != null && passwordEncoder.matches(jwtDto.getPassword(), user.getPassword())) {
            revokeAllUserTokens(user);
            String token = jwtTokenUtil.generateToken(user);
            Token userToken = Token.builder()
                    .token(token)
                    .tokenType(TokenType.BEARER)
                    .user(user)
                    .expired(false)
                    .revoked(false)
                    .build();

            tokenRepository.save(userToken);

            return JwtResponse.builder()
                    .token(token)
                    .expiresIn(jwtTokenUtil.getExpirationTime())
                    .build();
        } else {
            return null;
        }
    }
    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
}
