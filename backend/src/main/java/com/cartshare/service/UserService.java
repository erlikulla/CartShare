package com.cartshare.service;

import com.cartshare.dto.HouseholdDTO;
import com.cartshare.dto.UserDTO;
import com.cartshare.model.User;
import com.cartshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        if (user.getHousehold() != null) {
            HouseholdDTO householdDTO = new HouseholdDTO();
            householdDTO.setId(user.getHousehold().getId());
            householdDTO.setName(user.getHousehold().getName());
            householdDTO.setInviteCode(user.getHousehold().getInviteCode());
            dto.setHousehold(householdDTO);
        }

        return dto;
    }
}
