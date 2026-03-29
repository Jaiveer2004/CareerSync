const { Router } = require('express');
const { createService, getAllServices, getServiceById, getServiceProviders } = require('../controllers/service.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = Router();
router.post('/', protect, createService);
router.get('/', getAllServices);
router.get('/:serviceName/providers', getServiceProviders);
router.get('/:id', getServiceById);

module.exports = router;