import React, { useState } from 'react';



export default function Home() {

  const [formData, setFormData] = useState({

    fullName: '',

    workEmail: '',

    phone: '',

    companyName: '',

    sector: 'Urgent Care / Primary Care',

    locations: '1 Location',

    monthlyAppointments: 400,

    avgAppointmentValue: 120,

    estimatedDnaRate: 15,

    currentPmsSoftware: 'EMIS / Dentally',

    pilotReadiness: 'Ready immediately (within 30 days)'

  });

  

  const [status, setStatus] = useState('');



  const handleSubmit = async (e) => {

    e.preventDefault();

    setStatus('Submitting...');

    

    try {

      const res = await fetch('/api/pilots/apply', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(formData)

      });

      

      const data = await res.json();

      if (res.ok) {

        setStatus('Success! Application submitted.');

      } else {

        setStatus('Error: ' + data.message);

      }

    } catch (err) {

      setStatus('Failed to connect to server.');

    }

  };



  return (

    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#0f172a', color: '#fff', borderRadius: '12px' }}>

      <h1>Appointment Insurance™</h1>

      <p>Stop losing high-value revenue to empty slots and Did-Not-Attends.</p>

      

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>

        <input 

          type="text" 

          placeholder="Full Name" 

          required 

          value={formData.fullName} 

          onChange={e => setFormData({...formData, fullName: e.target.value})} 

          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}

        />

        <input 

          type="email" 

          placeholder="Work Email" 

          required 

          value={formData.workEmail} 

          onChange={e => setFormData({...formData, workEmail: e.target.value})} 

          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}

        />

        <input 

          type="text" 

          placeholder="Phone Number" 

          required 

          value={formData.phone} 

          onChange={e => setFormData({...formData, phone: e.target.value})} 

          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}

        />

        <input 

          type="text" 

          placeholder="Clinic / Business Name" 

          required 

          value={formData.companyName} 

          onChange={e => setFormData({...formData, companyName: e.target.value})} 

          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}

        />

        

        <button type="submit" style={{ padding: '12px', background: '#10b981', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>

          Apply for Pilot Access

        </button>

      </form>



      {status && <p style={{ marginTop: '15px', color: '#34d399' }}>{status}</p>}

    </div>

  );

}