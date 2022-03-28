import { Router } from 'express';
import { updateAvatar} from "../controllers/profile.js";

const APIProfile = Router();

APIProfile.post('/profile', updateAvatar)

export default APIProfile;