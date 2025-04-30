import express from 'express'
import { Adminlogin } from '../Controller/AdminController.js' 
import { AdminYekilendirme } from '../Middleware/AuthAdminMiddleware.js'

const router = express.Router() 


router.post("/login", Adminlogin) 
router.get("/ClientRegisterData", AdminYekilendirme, (req, res) => {

  res.json({ message: "Bu route'a erişim izniniz var" })
})

export default router;