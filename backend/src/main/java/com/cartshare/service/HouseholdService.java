package com.cartshare.service;

import com.cartshare.dto.HouseholdDTO;
import com.cartshare.dto.HouseholdRequest;
import com.cartshare.model.Household;
import com.cartshare.model.User;
import com.cartshare.repository.HouseholdRepository;
import com.cartshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Transactional
    public HouseholdDTO createHousehold(HouseholdRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getHousehold() != null) {
            throw new RuntimeException("User already belongs to a household");
        }

        Household household = new Household();
        household.setName(request.getName());
        household.setInviteCode(generateUniqueInviteCode());

        Household savedHousehold = householdRepository.save(household);

        currentUser.setHousehold(savedHousehold);
        userRepository.save(currentUser);

        return convertToDTO(savedHousehold);
    }

    @Transactional
    public HouseholdDTO joinHousehold(HouseholdRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getHousehold() != null) {
            throw new RuntimeException("User already belongs to a household");
        }

        Household household = householdRepository.findByInviteCode(request.getInviteCode())
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        currentUser.setHousehold(household);
        userRepository.save(currentUser);

        return convertToDTO(household);
    }

    private String generateUniqueInviteCode() {
        String code;
        do {
            code = generateRandomCode();
        } while (householdRepository.existsByInviteCode(code));
        return code;
    }

    private String generateRandomCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }
        return code.toString();
    }

    public HouseholdDTO convertToDTO(Household household) {
        HouseholdDTO dto = new HouseholdDTO();
        dto.setId(household.getId());
        dto.setName(household.getName());
        dto.setInviteCode(household.getInviteCode());
        return dto;
    }
}
