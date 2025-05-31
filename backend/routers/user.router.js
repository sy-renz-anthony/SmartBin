import express from 'express';
import userAuthentication from '../functions/userAuthentication.js';
import {register, update, login, logout, changePassword, sendPasswordResetOTP, resetPassword, getMyInfo, searchEmployees, getAllEmployees, isOTPCodesCorrect, validateMyPassword} from '../controllers/user.controller.js';

const router =express.Router();

router.post("/register", userAuthentication, register);
router.post("/login", login);
router.post("/logout", userAuthentication, logout);
router.post("/change-password", userAuthentication, changePassword);
router.post("/password-reset-otp", sendPasswordResetOTP);
router.post("/reset-password", resetPassword);
router.post("/is-valid-otp", isOTPCodesCorrect);
router.post("/validate-my-password", validateMyPassword);
router.put("/update", userAuthentication, update);
router.get("/my-info", userAuthentication, getMyInfo);
router.get("/search-employees", userAuthentication, searchEmployees);
router.get("/all", userAuthentication, getAllEmployees);

export default router;