import { NextResponse } from 'next/server';
import Appointment from '@/models/Appointment';
import sequelize from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    // Sync database
    await sequelize.sync();

    // Create record in database
    const appointment = await Appointment.create({
      name,
      phone,
      email,
      service,
      message,
    });

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email Template
    const mailOptions = {
      from: `"Kalyan Hospital Web" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Appointment Request: ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #ff0033; border-bottom: 2px solid #ff0033; padding-bottom: 10px;">New Appointment Request</h2>
          <p><strong>Patient Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email || 'Not provided'}</p>
          <p><strong>Service Requested:</strong> ${service}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #ff0033;">
            ${message || 'No additional message provided.'}
          </div>
          <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">This email was sent automatically from the Kalyan Robotic Hospital website.</p>
        </div>
      `,
    };

    // Send Email
    try {
      await transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.error('Email Sending Error:', emailError);
      // We don't fail the request if email fails, as DB record is created
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Appointment booked successfully!',
      data: appointment 
    }, { status: 201 });

  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to book appointment. Please try again.',
      error: error.message 
    }, { status: 500 });
  }
}
