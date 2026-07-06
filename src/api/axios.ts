import axios from "axios";
//se crea una instancia de axios en la variable API

const api = axios.create({
    baseURL : "/api",
    headers : {'Content-Type': 'application/json'},
})


api.interceptors.request.use((config) => {
        const token = localStorage.getItem('token')
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
        } 
        return Promise.reject(error)
    }
    
)

export default api;