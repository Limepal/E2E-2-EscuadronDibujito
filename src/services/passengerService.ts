import api from '../api/axios'
import type { Trip, User } from '../types/index'

export const getMyTrips = async () => {
  const { data } = await api.get<Trip[]>('/trips')
  return data
}

export const createTrip = async (pickupAddress: string, dropoffAddress: string) => {
  const { data } = await api.post<Trip>('/trips', { pickupAddress, dropoffAddress })
  return data
}

export const getTripById = async (id: number) => {
  const { data } = await api.get<Trip>(`/trips/${id}`)
  return data
}

export const rateTrip = async (id: number, rating: number, comment?: string) => {
  const { data } = await api.post<Trip>(`/trips/${id}/rate`, { rating, comment })
  return data
}

export const getAvailableDrivers = async () => {
  const { data } = await api.get<User[]>('/drivers/available')
  return data
}
