package ru.itmo.lnm.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import ru.itmo.lnm.backend.model.User;
import ru.itmo.lnm.backend.service.JwtTokenUtil;

import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class JwtTokenFilterTest {

    private JwtTokenFilter jwtTokenFilter;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    private UserDetailsService userDetailsService;
    private SecurityContext securityContext;
    private MockedStatic<SecurityContextHolder> securityContextHolder;
    private HttpServletRequest httpServletRequest;
    private FilterChain filterChain;
    private HttpServletResponse httpServletResponse;
    private static UserDetails user;
    private String token;
    private UsernamePasswordAuthenticationToken authToken;

    private final static String wrongJwtToken = "eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTYyMzkwMjJ9.gI-G5wsLrnMSKsl-lf1JRterBY-7urnWBW4pAILqMFk";
    private final static String invalidJwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.pQcQSKd2PPZiYM26FwpYWay2Hg7jgjkjpQ0xt_5Zih4";

    @BeforeAll
    static void setUpBeforeClass() throws Exception {
        user = User.builder()
                .username("test")
                .password("test")
                .email("test@test.com")
                .build();
    }

    @BeforeEach
    void setUp() {
        httpServletRequest = mock(HttpServletRequest.class);
        httpServletResponse = mock(HttpServletResponse.class);
        filterChain = mock(FilterChain.class);
        securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(null);
        securityContextHolder = mockStatic(SecurityContextHolder.class);
        securityContextHolder.when(SecurityContextHolder::getContext).thenReturn(securityContext);
        httpServletRequest = mock(HttpServletRequest.class);
        token = "Bearer " + jwtTokenUtil.generateToken((User) user);
        userDetailsService = mock(UserDetailsService.class);
        jwtTokenFilter = new JwtTokenFilter(jwtTokenUtil, userDetailsService);
        authToken = new UsernamePasswordAuthenticationToken(user,
                null, user.getAuthorities());

        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
    }

    @AfterEach
    void tearDown() throws Exception {
        securityContextHolder.close();
    }

    @Test
    public void loginUser() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn(token);
        when(userDetailsService.loadUserByUsername(user.getUsername())).thenReturn(user);

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(securityContext).setAuthentication(authToken);
        verify(filterChain).doFilter(httpServletRequest, httpServletResponse);
    }

    @Test
    public void noHeader() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(filterChain).doFilter(httpServletRequest, httpServletResponse);
    }

    @Test
    public void wrongHeader() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Basic 12:2t");

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(filterChain).doFilter(httpServletRequest, httpServletResponse);
    }

    @Test
    void authorizationHeaderIsTooShort() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer ");

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(httpServletResponse).sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Test
    void noSubjectInJwt() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer " + wrongJwtToken);

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(httpServletResponse).sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Test
    void noUserFound() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(userDetailsService.loadUserByUsername("test")).thenThrow(UsernameNotFoundException.class);

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(httpServletResponse).sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Test
    void invalidJwt() throws Exception {
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer " + invalidJwt);
        when(userDetailsService.loadUserByUsername("test")).thenReturn(user);

        jwtTokenFilter.doFilterInternal(httpServletRequest, httpServletResponse, filterChain);

        verify(httpServletResponse).sendError(HttpServletResponse.SC_UNAUTHORIZED);
    }
}
