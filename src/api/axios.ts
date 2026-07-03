//se importa el axios (obvio ps)
import axios from "axios";
//se crea una instancia de axios en la variable API

const api = axios.create({
    baseURL : import.meta.env.BASE_URL || '', //import -> meta -> env -> vite.. || "",
    headers : {"application-content": "JSON"}, //es ":", como si definieras el header en un dicc
    responseType: "json", //es response type, y json no requiere las llaves
    transformResponse: (data) => 
        {if (data.type === "string")    
        //falta verificar si el tipo de data es un string
        {
        try {
            //retorna JSON -> parsear la data
            return JSON.parse(data)
            } catch (error) {
                //error no va
                //si hace catch, retorna la data
                return data
            }
        
        }
    }
})

/*
baseURL (importada del env)
headers (contenido app json)
respuesta (json)
transformacion de la respuesta (data) en una funcion
*/

//falta modulo de request
//recibe como parametro congig
//lama al token del localstorage
//si el token existe -> config -> headers -> authe = Bearer y el token

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)


//luego

api.interceptors.response.use(
    //no te olvides de los parentesis, recuerda que es una funcion que recibe response y errors como parametros
    (response) => response,
    (error) => {

        if (error.response?.status == "401") {
            localStorage.removeItem("token")
        } 

        return Promise.reject(error)
    }
    
)

export default api;

/*Api -> Interceptors -> response -> use 
response => response,
error:
para verifcar el codigo de error se utiliza response?.status
    si el error es 401 se quita el token del local storage

    (sino) la promesa rechaza al error


    se exporta la api
*/