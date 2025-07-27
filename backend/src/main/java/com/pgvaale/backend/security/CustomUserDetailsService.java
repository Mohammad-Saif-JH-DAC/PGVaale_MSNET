package com.pgvaale.backend.security;

import com.pgvaale.backend.entity.*;
import com.pgvaale.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private OwnerRepository ownerRepository;
    
    @Autowired
    private MaidRepository maidRepository;
    
    @Autowired
    private TiffinRepository tiffinRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try to find user in each repository
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return createUserDetails(user.get(), "ROLE_USER");
        }
        
        Optional<Admin> admin = adminRepository.findByUsername(username);
        if (admin.isPresent()) {
            return createUserDetails(admin.get(), "ROLE_ADMIN");
        }
        
        Optional<Owner> owner = ownerRepository.findByUsername(username);
        if (owner.isPresent()) {
            return createUserDetails(owner.get(), "ROLE_OWNER");
        }
        
        Optional<Maid> maid = maidRepository.findByUsername(username);
        if (maid.isPresent()) {
            return createUserDetails(maid.get(), "ROLE_MAID");
        }
        
        Optional<Tiffin> tiffin = tiffinRepository.findByUsername(username);
        if (tiffin.isPresent()) {
            return createUserDetails(tiffin.get(), "ROLE_TIFFIN");
        }
        
        throw new UsernameNotFoundException("User not found: " + username);
    }
    
    private UserDetails createUserDetails(BaseEntity entity, String role) {
        GrantedAuthority authority = new SimpleGrantedAuthority(role);
        return new org.springframework.security.core.userdetails.User(
                entity.getUsername(),
                entity.getPassword(),
                true, // enabled
                true, true, true, // accountNonExpired, credentialsNonExpired, accountNonLocked
                Collections.singletonList(authority)
        );
    }
} 