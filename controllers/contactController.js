const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

// @desc    Send contact email and save to DB
// @route   POST /api/contact
// @access  Public
exports.sendContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      message
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact from ${name} - Portfolio`,
      text: message,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>This email was sent from your portfolio contact form.</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
};

// @desc    Get all contacts (for admin purposes)
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    next(err);
  }
};