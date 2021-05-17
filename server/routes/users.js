import { Router } from 'express';

const router = new Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.json([{
    id: 1,
    username: "samsepi0l"
  }, {
    id: 2,
    username: "D0loresH4ze"
  }]);
});

export default router;
