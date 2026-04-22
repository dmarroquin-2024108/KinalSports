import { Router } from 'express';
import { createField, getFields, getFieldById, updateField, changeFieldStatus } from './field.controller.js';
import { validateCreateField, validateUpdateFieldRequest, validateFieldStatusChange, validateGetFieldById } from '../../middlewares/field-validator.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';
import { cleanupUploadedFileOnFinish } from '../../middlewares/delete-file-on-error.js';
import { requireRole } from '../../middlewares/validate-role.js';
import { authOrInternal } from '../../middlewares/validate-internal-token.js';

const router = Router();
router.post(
    '/',
    uploadFieldImage.single('photo'),
    cleanupUploadedFileOnFinish,
    validateCreateField,
    requireRole('ADMIN_ROLE'),
    createField
);

// Rutas GET - Consumibles tanto por el frontend como por otros microservicios
router.get('/', authOrInternal, getFields);
router.get('/:id', authOrInternal, validateGetFieldById, getFieldById);

// Rutas PUT - Solo para administradores
router.put(
    '/:id',
    uploadFieldImage.single('photo'),
    cleanupUploadedFileOnFinish,
    validateUpdateFieldRequest,
    requireRole('ADMIN_ROLE'), // Validar rol antes de procesar archivos
    updateField
);

router.put(
    '/:id/activate',
    validateFieldStatusChange,
    requireRole('ADMIN_ROLE'),
    changeFieldStatus
);

router.put(
    '/:id/deactivate',
    validateFieldStatusChange,
    requireRole('ADMIN_ROLE'),
    changeFieldStatus
);
export default router;