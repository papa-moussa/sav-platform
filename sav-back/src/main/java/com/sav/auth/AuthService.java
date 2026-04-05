package com.sav.auth;

import com.sav.common.dto.LoginRequest;
import com.sav.common.dto.LoginResponse;
import com.sav.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        UserEntity user = (UserEntity) auth.getPrincipal();
        String token = jwtService.generateToken(user);
        Long companyId   = user.getCompany() != null ? user.getCompany().getId()  : null;
        String companyNom = user.getCompany() != null ? user.getCompany().getName() : null;
        return new LoginResponse(token, user.getRole(), user.getNom(), companyId, companyNom);
    }
}
