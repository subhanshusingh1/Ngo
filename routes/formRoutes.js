// import modules
import express from "express";
import submitForm from "../controllers/formController.js";


const router = express.Router();

router.post('/', submitForm)

export default router
