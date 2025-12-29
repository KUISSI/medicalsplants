package com.medicalsplants.security;

import com.medicalsplants.model.entity.User;
import com.medicalsplants.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Custom UserDetailsService implementation. 
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Loads user by email (used as username).
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with email: " + email
        ));

        return CustomUserDetails.fromUser(user);
    }

    // Loads user by ID.
    @Transactional(readOnly = true)
    public UserDetails loadUserById(String id) {
        log.debug("Loading user by ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException(
                "User not found with id:  " + id
        ));

        return CustomUserDetails.fromUser(user);
    }

    //  Loads user by email (alias for loadUserByUsername).
    @Transactional(readOnly = true)
    public UserDetails loadUserByEmail(String email) {
        return loadUserByUsername(email);
    }
}
