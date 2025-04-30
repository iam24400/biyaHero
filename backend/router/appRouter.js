import express from "express";
import { viewHistory } from "../services/history.js"

const router = express.Router();


router.get('/history/:user_id', viewHistory);


export default router;