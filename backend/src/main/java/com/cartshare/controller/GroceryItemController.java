package com.cartshare.controller;

import com.cartshare.dto.GroceryItemDTO;
import com.cartshare.dto.GroceryItemRequest;
import com.cartshare.service.GroceryItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class GroceryItemController {

    private final GroceryItemService groceryItemService;

    @PostMapping
    public ResponseEntity<GroceryItemDTO> createItem(@Valid @RequestBody GroceryItemRequest request) {
        return ResponseEntity.ok(groceryItemService.createItem(request));
    }

    @GetMapping("/active")
    public ResponseEntity<List<GroceryItemDTO>> getActiveItems() {
        return ResponseEntity.ok(groceryItemService.getActiveItems());
    }

    @GetMapping("/history")
    public ResponseEntity<List<GroceryItemDTO>> getPurchaseHistory() {
        return ResponseEntity.ok(groceryItemService.getPurchaseHistory());
    }

    @PatchMapping("/{id}/claim")
    public ResponseEntity<GroceryItemDTO> claimItem(@PathVariable Long id) {
        return ResponseEntity.ok(groceryItemService.claimItem(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<GroceryItemDTO> completeItem(
            @PathVariable Long id,
            @Valid @RequestBody GroceryItemRequest request) {
        return ResponseEntity.ok(groceryItemService.completeItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        groceryItemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
