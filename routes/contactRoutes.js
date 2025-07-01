const express = require('express');
const { 
  sendContact,
  getContacts 
} = require('../controllers/contactController');

const router = express.Router();

router.post('/', sendContact);
router.get('/', getContacts); // For admin panel (you can add auth later)

module.exports = router;