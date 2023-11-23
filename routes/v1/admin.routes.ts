import express from "express";
import { createVendor, getVendorById, getVendors } from "../../controllers/v1";
const router = express.Router()

router.post('/vendor', createVendor);
router.get('/vendor', getVendors);
router.get('/vendor/:id', getVendorById)

export {router as AdminRoute }