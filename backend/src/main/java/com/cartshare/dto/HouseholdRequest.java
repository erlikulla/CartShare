package com.cartshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HouseholdRequest {
    @NotBlank(message = "Household name is required")
    private String name;

    private String inviteCode;
}
