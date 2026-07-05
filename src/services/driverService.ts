import api from '../api/axios'
import type { Trip } from '../types/index'

export const getPendingTrips = async () => {
    const {data} = await api.get<Trip[]>('/trips/pending')
    return data
}

export const getMyTrips = async () => {
    const {data} = await api.get<Trip[]>('/trips/my')
    return data
}

export const getTripById = async (id : number) =>{
    const {data} = await api.get<Trip>(`/trips/${id}`)
    return data
}


export const acceptTrip = async(id:number)=>{
    const {data} = await api.patch<Trip>(`/trips/${id}/accept`)
    return data
}

export const completeTrip = async (id:number) => {
    const {data} = await api.patch<Trip>(`/trips/${id}/complete`)
    return data
}

