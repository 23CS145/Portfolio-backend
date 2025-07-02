const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// @desc Send contact email + save to DB
// @route POST /api/contact
exports.sendContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    const contact = await Contact.create({ name, email, message });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <small>Sent from portfolio contact form.</small>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    console.error('Email Error:', err);
    next(err);
  }
};

// @desc Get all contacts (admin usage)
// @route GET /api/contact
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    next(err);
  }
};
