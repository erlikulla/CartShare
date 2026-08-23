package com.cartshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdDTO {
    private Long id;
    private String name;
    private String inviteCode;
}
