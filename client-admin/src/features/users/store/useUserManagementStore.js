import { create } from "zustand";
import { getAllUsers as getAllUsersRequest } from "../../../shared/apis";

export const useManagementStore = create((set, get)=>({
    users:[],
    loading: false,
    error: null,
    filters: {},

    setFilters: (filters) => set({filters}),

    setUser: (users)=> set({users}),

    getAllUsers: async(apiFn = getAllUsersRequest, options ={})=>{
        try{
            const {force = false} = options;
            const state = get();

            if(state.loading) return; //Interrumpir el proceso porque está cargando la informacion
            if(!force && state.users.length > 0) return; //Es como el otro

            set({loading: true, error: null});
            const fetcher = typeof apiFn === "function"? apiFn : getAllUsersRequest;
            const response = await fetcher();

            set({
                users: response.users || response,
                loading: false,
            })
        }catch(e){
            set({
                error: e.response?.data?.message || "Error al listar usuarios",
                loading: false,
            })
        }
    }
}))