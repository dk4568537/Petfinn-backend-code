// const express = require('express');
// const router = express.Router();
// const Event = require('../models/Eventes');

// // Create a new event
// router.post('/', async (req, res) => {
//   const { email, firstName, lastname, address, appartment, city, zip, phoneno } = req.body;
//   try {
//     const newEvent = new Event({ email, firstName, lastname, address, appartment, city, zip, phoneno });
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to create event' });
//   }
// });

// // Get all events for a specific date
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find({ });
//     res.status(200).json(events);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch events' });
//   }
// });

// // Update an event
// router.put('/:id', async (req, res) => {
//   const { id } = req.params;
//   const { email, firstName, lastname, address, appartment, city, zipcode, phoneno } = req.body;
//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(
//       id,
//       { email, firstName, lastname, address, appartment, city, zipcode, phoneno  },
//       { new: true }
//     );
//     if (!updatedEvent) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.status(200).json(updatedEvent);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to update event' });
//   }
// });

// // Delete an event
// router.delete('/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(id);
//     if (!deletedEvent) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.status(200).json({ message: 'Event deleted' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to delete event' });
//   }
// });

// module.exports = router;
// pages/api/checkout.js
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, firstName, lastName, address, city, state, zip, phone, newsletter, total } = req.body;

      // Create a customer in Stripe (optional, you can skip this and directly create a payment)
      const customer = await stripe.customers.create({
        email,
        name: `${firstName} ${lastName}`,
        address: {
          line1: address,
          city,
          state,
          postal_code: zip,
        },
        phone,
        metadata: {
          newsletter,
        },
      });

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // convert to smallest currency unit
        currency: 'usd',
        customer: customer.id, // Associate customer with payment
        description: `Order by ${firstName} ${lastName}`,
        metadata: {
          orderId: uuidv4(),
        },
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

