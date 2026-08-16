import { MongoClient } from 'mongodb';



const uri = process.env.MONGODB_URI;



export default async function handler(req, res) {

  if (req.method !== 'POST') {

    return res.status(405).json({ message: 'Method not allowed' });

  }



  const payload = req.body;



  // Basic Validation

  if (!payload.fullName || !payload.workEmail || !payload.companyName) {

    return res.status(422).json({ message: 'Missing required fields' });

  }



  // Calculate Financial Impact Metrics

  const monthlyVolume = Number(payload.monthlyAppointments || 400);

  const slotValue = Number(payload.avgAppointmentValue || 120);

  const dnaPercent = Number(payload.estimatedDnaRate || 15) / 100;



  const monthlyLostSlots = Math.round(monthlyVolume * dnaPercent);

  const monthlyRevenueLoss = monthlyLostSlots * slotValue;

  const annualRevenueLoss = monthlyRevenueLoss * 12;

  const annualProtectedRevenue = Math.round(annualRevenueLoss * 0.80);



  const applicationRecord = {

    appId: `APP-PLT-${Date.now().toString().slice(-6)}`,

    createdAt: new Date().toISOString(),

    applicant: {

      fullName: payload.fullName,

      email: payload.workEmail,

      phone: payload.phone,

      companyName: payload.companyName,

    },

    operations: {

      sector: payload.sector,

      locations: payload.locations,

      monthlyAppointments: monthlyVolume,

      avgAppointmentValue: slotValue,

      estimatedDnaRate: payload.estimatedDnaRate,

      pmsSoftware: payload.currentPmsSoftware,

      pilotReadiness: payload.pilotReadiness,

    },

    computedEvidenceMetrics: {

      monthlyLostSlots,

      monthlyRevenueLoss,

      annualRevenueLoss,

      annualProtectedRevenue

    },

    status: 'PENDING_ONBOARDING_REVIEW',

  };



  try {

    if (!uri) {

      // Fallback response for testing without a database connection

      return res.status(201).json({

        success: true,

        message: 'Application recorded (Local Mode)',

        data: applicationRecord

      });

    }



    const client = new MongoClient(uri);

    await client.connect();

    const db = client.db('appointment_insurance');

    await db.collection('pilot_applications').insertOne(applicationRecord);

    await client.close();



    return res.status(201).json({

      success: true,

      message: 'Pilot application recorded successfully',

      data: applicationRecord

    });

  } catch (error) {

    console.error('Database Error:', error);

    return res.status(500).json({ message: 'Server error saving application' });

  }

}