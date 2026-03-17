import express from 'express';
import { getProducts } from './controllers/products.controllers';
import { getCategories } from './controllers/categories.controllers';
import { protect } from './middleware/auth.middleware';
import { findUserById, createUser } from './models/User';

const router = express.Router();

router.get('/products', getProducts);
router.get('/categories', getCategories);
// ...

// please disregard the lines below
router.get('/', (req, res) => { return res.json({ message: 'Hello World' }); });
router.get('/me', protect, async (req, res) => { const user = await findUserById(req.body.user); if (user) { res.json({ user }); } else { res.status(404).json({ message: 'User not found' }); }});
router.post('/register', async (req, res) => { const user = await createUser(req.body.email, req.body.password); if (user) { res.json({ user }); } else { res.status(400).json({ message: 'Error while registering' });}});
export default router;