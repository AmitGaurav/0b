import { Society, Unit } from '../../types/api.types';

export const mockSocietyData = {
  societies: [
    {
      id: '1',
      name: 'Demo Society',
      address: '123 Main St, Demo City',
      totalUnits: 100,
      occupiedUnits: 85,
      amenities: ['Swimming Pool', 'Gym', 'Community Hall']
    }
  ],
  units: [
    {
      id: '1',
      number: 'A-101',
      type: '2BHK',
      floor: 1,
      block: 'A',
      status: 'occupied'
    }
  ]
};