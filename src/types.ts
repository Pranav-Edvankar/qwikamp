export interface CycleProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
  specs: {
    range: string;
    speed: string;
    weight: string;
    battery: string;
    frame: string;
  };
  description: string;
  colors: string[];
  isPart?: boolean;
}

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  iconType: 'wrench' | 'shield' | 'shopping-bag' | 'truck';
  colorTheme: 'amber' | 'green' | 'blue' | 'purple';
  longDescription: string;
  priceEstimate: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  cycleModel: string;
  date: string;
  timeSlot: string;
  location: string;
  status: 'pending' | 'technician_dispatched' | 'under_maintenance' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
  steps: {
    title: string;
    description: string;
    time: string;
    completed: boolean;
    active: boolean;
  }[];
}

export interface UserStats {
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  cycleModel: string;
  totalMiles: number;
  co2SavedKg: number;
  batteryHealth: number;
  serviceIntervalDays: number;
}
