package com.cartshare.controller;

import com.cartshare.dto.HouseholdDTO;
import com.cartshare.dto.HouseholdRequest;
import com.cartshare.service.HouseholdService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/households")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;

    @PostMapping("/create")
    public ResponseEntity<HouseholdDTO> createHousehold(@Valid @RequestBody HouseholdRequest request) {
        return ResponseEntity.ok(householdService.createHousehold(request));
    }

    @PostMapping("/join")
    public ResponseEntity<HouseholdDTO> joinHousehold(@Valid @RequestBody HouseholdRequest request) {
        return ResponseEntity.ok(householdService.joinHousehold(request));
    }
}
