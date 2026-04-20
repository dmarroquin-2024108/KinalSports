import { create } from "zustand";
import { getFields as getFieldsRequest,
    createField as createFieldRequest,
 } from "../../../shared/apis";

export const useFieldsStore = create((set, get)=>({
    fields: [],
    loading: false,
    error: null,

    getFields: async()=>{
        try{
            set({loading:true, error: null})
            const response = await getFieldsRequest();

            set({
                fields: response.data.data,
                loading: false,
            })
        }catch(e){
            set({
                error: e.response?.data?.message || "Error al listar canchas",
                loading: false,
            })
        }
    },//ListarCampos

    createField: async(FormData)=>{
        try{
            set({loading: true, error: null})
 
            const response = await createFieldRequest(FormData);
 
            set({
                fields: [response.data.data, ...get().fields()],
                loading: false,
            })
        }catch(e){
            set({
                loading: false,
                error: e.response?.data?.message || "Error al crear la cancha",
            })
        }
    }
}))