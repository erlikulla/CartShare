import api from './api';

export interface GroceryItem {
  id: number;
  name: string;
  quantity: number;
  category: string;
  addedBy: string;
  addedById: number;
  claimedBy?: string;
  claimedById?: number;
  purchasedBy?: string;
  purchasedById?: number;
  price?: number;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export const groceryService = {
  async createItem(name: string, quantity: number, category: string): Promise<GroceryItem> {
    const response = await api.post<GroceryItem>('/items', { name, quantity, category });
    return response.data;
  },

  async getActiveItems(): Promise<GroceryItem[]> {
    const response = await api.get<GroceryItem[]>('/items/active');
    return response.data;
  },

  async getPurchaseHistory(): Promise<GroceryItem[]> {
    const response = await api.get<GroceryItem[]>('/items/history');
    return response.data;
  },

  async claimItem(itemId: number): Promise<GroceryItem> {
    const response = await api.patch<GroceryItem>(`/items/${itemId}/claim`);
    return response.data;
  },

  async completeItem(itemId: number, price: number): Promise<GroceryItem> {
    const response = await api.patch<GroceryItem>(`/items/${itemId}/complete`, { price });
    return response.data;
  },

  async deleteItem(itemId: number): Promise<void> {
    await api.delete(`/items/${itemId}`);
  },
};
