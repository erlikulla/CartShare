import api from './api';

interface Household {
  id: number;
  name: string;
  inviteCode: string;
}

export const householdService = {
  async createHousehold(name: string): Promise<Household> {
    const response = await api.post<Household>('/households/create', { name });
    return response.data;
  },

  async joinHousehold(inviteCode: string): Promise<Household> {
    const response = await api.post<Household>('/households/join', { inviteCode });
    return response.data;
  },
};
