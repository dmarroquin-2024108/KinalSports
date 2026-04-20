import {axiosAdmin} from './api.js'

export const getFields = async()=>{
    return await axiosAdmin.get("/fields");
}

export const createField = async(data)=>{
    return await axiosAdmin.post("fields", data, {
        headers:{"Content-Type": "multipart/form-data"},
    })
}