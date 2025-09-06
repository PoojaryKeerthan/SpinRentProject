package com.spinrent.spinrentbackend.cache;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserCache {
    private final Map<String, UserDetails> cache = new ConcurrentHashMap<>();

    public UserDetails get(String clerkId) {
        return cache.get(clerkId);
    }

    public void put(String clerkId, UserDetails user) {
        cache.put(clerkId, user);
    }

    public boolean contains(String clerkId) {
        return cache.containsKey(clerkId);
    }
}
