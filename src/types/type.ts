type Role = 'PASSENGER' | 'DRIVER';
type TripStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  available: boolean;
  rating: number;
}

export interface Trip {
  id: number;
  status: TripStatus;
  pickupAddress: string;
  dropoffAddress: string;
  requestedAt: string;       // ISO 8601
  acceptedAt: string | null;
  completedAt: string | null;
  passenger: User;
  driver: User | null;
  passengerRating: number | null;
  ratingComment: string | null;
}

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserRegister{
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: Role
}

export interface Error {
  additionalProp1: string,
  additionalProp2: string,
  additionalProp3: string
}