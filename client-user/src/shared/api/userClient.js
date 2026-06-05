// File: client-user/src/shared/api/userClient.js
import { createApiClient } from './authClient';
import { ENDPOINTS } from '../constants/endpoints';

export const userClient = createApiClient(ENDPOINTS.USER);

export default userClient;
