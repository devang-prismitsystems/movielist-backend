const { Router } = require("express");
const router = Router();

const { login, signup, userProfile } = require("../controllers/userController");
const { validateKey } = require("../middlewares/authMiddleware");

router.route('/login').post(login);
router.route('/signup').post(signup);
router.route('/profile').get(validateKey, userProfile);

export default router;