const { Router } = require("express");
const router = Router();

const { login, signup, userProfile } = require("../controllers/userController");

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/profile').get(userProfile);

export default router;