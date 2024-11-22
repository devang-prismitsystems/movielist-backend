const { Router } = require("express");
const router = Router();

const { validateKey } = require("../middlewares/authMiddleware");

const { getList, createMovie, updateMovie, getMovieDetails, deleteMovie } = require("../controllers/movieController");

router.route('/')
    .get(validateKey, getList)
    .post(validateKey, createMovie)
    .put(validateKey, updateMovie)
    .delete(validateKey, deleteMovie);

router.get('/details/:id', validateKey, getMovieDetails);

export default router;