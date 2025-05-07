const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/ehr_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: { type: String, enum: ['doctor', 'patient'] },
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const doctorSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  department: { type: String },
  phone_number: { type: String },
  email: { type: String },
  address: { type: String },
  national_id: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now }
});
const Doctor = mongoose.model('Doctor', doctorSchema);

const patientSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    phone_number: { type: String },
    email: { type: String },
    address: { type: String },
    national_id: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now }
});
const Patient = mongoose.model('Patient', patientSchema);

const recordSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true},
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true},
    date: Date,
    diagnosis: String,
    prescription: String,
    note: String,
    created_at: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = {
    User,
    Doctor,
    Patient,
    Record
};

app.get('/api/patients/:id', async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) return res.status(404).json({ message: "Not found" });
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

app.post('/api/patients', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.status(201).json(savedPatient);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request' });
    }
});

app.get('/api/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/doctors', async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        res.status(201).json(savedDoctor);
    } catch (error) {
        res.status(400).json({ message: 'Bad Request' });
    }
});

app.get('/api/records', async (req, res) => {
    try {
      const filter = {};
      if (req.query.patient_id) {
        filter.patient_id = req.query.patient_id;
      }
      const records = await Record.find(filter).populate('doctor_id');
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  });


app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

