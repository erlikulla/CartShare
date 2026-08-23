package com.cartshare.service;

import com.cartshare.dto.GroceryItemDTO;
import com.cartshare.dto.GroceryItemRequest;
import com.cartshare.model.GroceryItem;
import com.cartshare.model.Household;
import com.cartshare.model.User;
import com.cartshare.repository.GroceryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroceryItemService {

    private final GroceryItemRepository groceryItemRepository;
    private final UserService userService;

    @Transactional
    public GroceryItemDTO createItem(GroceryItemRequest request) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getHousehold() == null) {
            throw new RuntimeException("User must belong to a household to create items");
        }

        GroceryItem item = new GroceryItem();
        item.setName(request.getName());
        item.setQuantity(request.getQuantity());
        item.setCategory(request.getCategory());
        item.setAddedBy(currentUser);
        item.setHousehold(currentUser.getHousehold());
        item.setCompleted(false);

        GroceryItem savedItem = groceryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    public List<GroceryItemDTO> getActiveItems() {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getHousehold() == null) {
            throw new RuntimeException("User must belong to a household");
        }

        List<GroceryItem> items = groceryItemRepository.findByHouseholdAndCompletedOrderByCreatedAtDesc(
                currentUser.getHousehold(), false);

        return items.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<GroceryItemDTO> getPurchaseHistory() {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getHousehold() == null) {
            throw new RuntimeException("User must belong to a household");
        }

        List<GroceryItem> items = groceryItemRepository.findByHouseholdAndCompletedOrderByCreatedAtDesc(
                currentUser.getHousehold(), true);

        return items.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public GroceryItemDTO claimItem(Long itemId) {
        User currentUser = userService.getCurrentUser();
        GroceryItem item = getItemAndVerifyAccess(itemId, currentUser.getHousehold());

        if (item.getCompleted()) {
            throw new RuntimeException("Cannot claim a completed item");
        }

        if (item.getClaimedBy() != null && item.getClaimedBy().getId().equals(currentUser.getId())) {
            item.setClaimedBy(null);
        } else {
            item.setClaimedBy(currentUser);
        }

        GroceryItem savedItem = groceryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Transactional
    public GroceryItemDTO completeItem(Long itemId, GroceryItemRequest request) {
        User currentUser = userService.getCurrentUser();
        GroceryItem item = getItemAndVerifyAccess(itemId, currentUser.getHousehold());

        if (item.getCompleted()) {
            throw new RuntimeException("Item already completed");
        }

        item.setCompleted(true);
        item.setPrice(request.getPrice());
        item.setPurchasedBy(currentUser);
        item.setCompletedAt(LocalDateTime.now());

        GroceryItem savedItem = groceryItemRepository.save(item);
        return convertToDTO(savedItem);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        User currentUser = userService.getCurrentUser();
        GroceryItem item = getItemAndVerifyAccess(itemId, currentUser.getHousehold());

        groceryItemRepository.delete(item);
    }

    private GroceryItem getItemAndVerifyAccess(Long itemId, Household household) {
        GroceryItem item = groceryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getHousehold().getId().equals(household.getId())) {
            throw new RuntimeException("Access denied to this item");
        }

        return item;
    }

    public GroceryItemDTO convertToDTO(GroceryItem item) {
        GroceryItemDTO dto = new GroceryItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setQuantity(item.getQuantity());
        dto.setCategory(item.getCategory());
        dto.setCompleted(item.getCompleted());
        dto.setPrice(item.getPrice());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setCompletedAt(item.getCompletedAt());

        if (item.getAddedBy() != null) {
            dto.setAddedBy(item.getAddedBy().getName());
            dto.setAddedById(item.getAddedBy().getId());
        }

        if (item.getClaimedBy() != null) {
            dto.setClaimedBy(item.getClaimedBy().getName());
            dto.setClaimedById(item.getClaimedBy().getId());
        }

        if (item.getPurchasedBy() != null) {
            dto.setPurchasedBy(item.getPurchasedBy().getName());
            dto.setPurchasedById(item.getPurchasedBy().getId());
        }

        return dto;
    }
}
