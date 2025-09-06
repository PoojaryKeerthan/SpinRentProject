package com.spinrent.spinrentbackend.security;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.JWSKeySelector;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.proc.ConfigurableJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTProcessor;
import com.nimbusds.jwt.proc.DefaultJWTClaimsVerifier;
import com.nimbusds.jose.proc.JWSVerificationKeySelector;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.net.URL;

@Component
public class ClerkTokenVerifier {

    private final ConfigurableJWTProcessor<SecurityContext> jwtProcessor;

    public ClerkTokenVerifier() throws Exception {
        RemoteJWKSet keySource = new RemoteJWKSet<>(new URL("https://enhanced-squirrel-38.clerk.accounts.dev/.well-known/jwks.json"));
        jwtProcessor = new DefaultJWTProcessor<>();
        JWSKeySelector<SecurityContext> keySelector = new JWSVerificationKeySelector<>(com.nimbusds.jose.JWSAlgorithm.RS256, keySource);
        jwtProcessor.setJWSKeySelector(keySelector);
    }

    public JWTClaimsSet verify(String token) throws Exception {
        return jwtProcessor.process(token, null);
    }
}
