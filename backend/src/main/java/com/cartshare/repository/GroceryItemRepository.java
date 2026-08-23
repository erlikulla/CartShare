package com.cartshare.repository;

import com.cartshare.model.GroceryItem;
import com.cartshare.model.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroceryItemRepository extends JpaRepository<GroceryItem, Long> {
    List<GroceryItem> findByHouseholdAndCompletedOrderByCreatedAtDesc(Household household, Boolean completed);
    List<GroceryItem> findByHouseholdOrderByCreatedAtDesc(Household household);
}
