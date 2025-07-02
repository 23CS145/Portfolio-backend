const express = require('express');
const router = express.Router();
const { sendContact, getContacts } = require('../controllers/contactController');

router.post('/', sendContact);
router.get('/', getContacts); // Optionally protect with admin auth

module.exports = router;
