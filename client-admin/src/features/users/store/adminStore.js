import { create } from "zustand";
import { getFields as getFieldsRequest,
    createField as createFieldRequest,
    updateField as updateFieldRequest,
    deleteField as deleteFieldRequest
 } from "../../../shared/apis";
import { get } from "react-hook-form";

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
    },

    updateField: async(id, FormData)=>{
        try{
            set({loading: true, error: null});
            
            const response = await updateFieldRequest(id, FormData);
            set({
                fields: get().fields.map((field)=>
                    field._id === id ? response.data.data : field,
                ),
                loading: false,
            })
        }catch(e){
            set({
                loading: false,
                error: e.response?.data?.message || "Error al actualizar la cancha",
            })
        }
    },

    deleteField: async(id) =>{
        try{
            set({loading: true, error: null});
            await deleteFieldRequest(id);
            set({
                fields: get().fields.filter((field)=> field._id !== id),
                loading: false
            })
        }catch(e){
          set({
                loading: false,
                error: e.response?.data?.message || "Error al eliminar la cancha",
            })  
        }
    }
})) 