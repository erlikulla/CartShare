package com.cartshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroceryItemDTO {
    private Long id;
    private String name;
    private Integer quantity;
    private String category;
    private String addedBy;
    private Long addedById;
    private String claimedBy;
    private Long claimedById;
    private String purchasedBy;
    private Long purchasedById;
    private BigDecimal price;
    private Boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
