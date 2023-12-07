const userController = require("../controllers/user_controller");
const express = require('express');
const router = express.Router();

router.get('/profile/:id', userController.profilePage);  // This is route . matlab jis link pe kam karwana hai  
                                                     /* Here it will be checked whather it has user1 or user2. According to that it will return*/
router.get('/sendemail', userController.sendemail);
router.get("/forgot-password", userController.forgotPassword);

module.exports = router;
 