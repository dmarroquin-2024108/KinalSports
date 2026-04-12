import { createFieldRecord } from "./field.service.js";

export const createField = async(req, res)=>{
    try{
        const field = await createFieldRecord({
            fieldData: req.body,
            file: req.file
        })
        res.status(201).json({
            success: true,
            message: 'Cancha registrada exitosamente',
            data: field
        })
    }catch(err){
        res.status(500).json({
           succes: false,
           message: 'Error al registrar la cancha',
           error: err.message 
        })
    }
}