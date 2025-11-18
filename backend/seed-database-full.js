// Script to seed database with doctors, patients, appointments, and prescriptions
require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');
const Prescription = require('./models/Prescription');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a user for appointments (createdBy field)
    let adminUser = await User.findOne({ email: 'divyanshdobhal64@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'divyanshdobhal64@gmail.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user ready');
    }

    // Sample Doctors
    const doctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        contactInfo: {
          phone: '+1-555-0101',
          email: 'sarah.johnson@hospital.com',
          address: {
            street: '123 Medical Center Dr',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
          },
        },
        qualifications: ['MD', 'FACC', 'Cardiology Board Certified'],
        licenseNumber: 'MD-12345',
        experience: 15,
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: '09:00',
          endTime: '17:00',
        },
        status: 'Active',
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        contactInfo: {
          phone: '+1-555-0102',
          email: 'michael.chen@hospital.com',
          address: {
            street: '456 Health Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
          },
        },
        qualifications: ['MD', 'PhD', 'Neurology Board Certified'],
        licenseNumber: 'MD-12346',
        experience: 12,
        availability: {
          days: ['Monday', 'Wednesday', 'Friday'],
          startTime: '10:00',
          endTime: '18:00',
        },
        status: 'Active',
      },
      {
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        contactInfo: {
          phone: '+1-555-0103',
          email: 'emily.rodriguez@hospital.com',
          address: {
            street: '789 Care Blvd',
            city: 'New York',
            state: 'NY',
            zipCode: '10003',
          },
        },
        qualifications: ['MD', 'FAAP', 'Pediatrics Board Certified'],
        licenseNumber: 'MD-12347',
        experience: 10,
        availability: {
          days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          startTime: '08:00',
          endTime: '16:00',
        },
        status: 'Active',
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        contactInfo: {
          phone: '+1-555-0104',
          email: 'james.wilson@hospital.com',
          address: {
            street: '321 Bone St',
            city: 'New York',
            state: 'NY',
            zipCode: '10004',
          },
        },
        qualifications: ['MD', 'FACS', 'Orthopedic Surgery Board Certified'],
        licenseNumber: 'MD-12348',
        experience: 18,
        availability: {
          days: ['Tuesday', 'Wednesday', 'Thursday'],
          startTime: '09:00',
          endTime: '17:00',
        },
        status: 'Active',
      },
      {
        name: 'Dr. Priya Patel',
        specialty: 'Dermatology',
        contactInfo: {
          phone: '+1-555-0105',
          email: 'priya.patel@hospital.com',
          address: {
            street: '654 Skin Care Ln',
            city: 'New York',
            state: 'NY',
            zipCode: '10005',
          },
        },
        qualifications: ['MD', 'FAAD', 'Dermatology Board Certified'],
        licenseNumber: 'MD-12349',
        experience: 8,
        availability: {
          days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          startTime: '10:00',
          endTime: '18:00',
        },
        status: 'Active',
      },
      {
        name: 'Dr. Robert Brown',
        specialty: 'General Medicine',
        contactInfo: {
          phone: '+1-555-0106',
          email: 'robert.brown@hospital.com',
          address: {
            street: '987 Wellness Way',
            city: 'New York',
            state: 'NY',
            zipCode: '10006',
          },
        },
        qualifications: ['MD', 'Internal Medicine Board Certified'],
        licenseNumber: 'MD-12350',
        experience: 20,
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: '08:00',
          endTime: '16:00',
        },
        status: 'Active',
      },
    ];

    // Sample Patients
    const patients = [
      {
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        contactInfo: {
          phone: '+1-555-1001',
          email: 'john.smith@email.com',
          address: {
            street: '100 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10010',
          },
        },
        medicalHistory: {
          allergies: ['Penicillin', 'Peanuts'],
          chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
          previousSurgeries: ['Appendectomy (2010)'],
          medications: ['Metformin', 'Lisinopril'],
          bloodGroup: 'A+',
        },
        emergencyContact: {
          name: 'Jane Smith',
          relationship: 'Wife',
          phone: '+1-555-1002',
        },
        status: 'Active',
      },
      {
        name: 'Maria Garcia',
        age: 32,
        gender: 'Female',
        contactInfo: {
          phone: '+1-555-1003',
          email: 'maria.garcia@email.com',
          address: {
            street: '200 Oak Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10011',
          },
        },
        medicalHistory: {
          allergies: [],
          chronicConditions: ['Asthma'],
          previousSurgeries: [],
          medications: ['Albuterol'],
          bloodGroup: 'O+',
        },
        emergencyContact: {
          name: 'Carlos Garcia',
          relationship: 'Husband',
          phone: '+1-555-1004',
        },
        status: 'Active',
      },
      {
        name: 'David Lee',
        age: 28,
        gender: 'Male',
        contactInfo: {
          phone: '+1-555-1005',
          email: 'david.lee@email.com',
          address: {
            street: '300 Pine Rd',
            city: 'New York',
            state: 'NY',
            zipCode: '10012',
          },
        },
        medicalHistory: {
          allergies: ['Shellfish'],
          chronicConditions: [],
          previousSurgeries: ['Knee Surgery (2020)'],
          medications: [],
          bloodGroup: 'B+',
        },
        emergencyContact: {
          name: 'Lisa Lee',
          relationship: 'Sister',
          phone: '+1-555-1006',
        },
        status: 'Active',
      },
      {
        name: 'Jennifer Taylor',
        age: 55,
        gender: 'Female',
        contactInfo: {
          phone: '+1-555-1007',
          email: 'jennifer.taylor@email.com',
          address: {
            street: '400 Elm St',
            city: 'New York',
            state: 'NY',
            zipCode: '10013',
          },
        },
        medicalHistory: {
          allergies: ['Latex'],
          chronicConditions: ['Arthritis', 'Osteoporosis'],
          previousSurgeries: ['Hip Replacement (2018)'],
          medications: ['Ibuprofen', 'Calcium Supplements'],
          bloodGroup: 'AB+',
        },
        emergencyContact: {
          name: 'Mark Taylor',
          relationship: 'Husband',
          phone: '+1-555-1008',
        },
        status: 'Active',
      },
      {
        name: 'Michael Anderson',
        age: 38,
        gender: 'Male',
        contactInfo: {
          phone: '+1-555-1009',
          email: 'michael.anderson@email.com',
          address: {
            street: '500 Maple Dr',
            city: 'New York',
            state: 'NY',
            zipCode: '10014',
          },
        },
        medicalHistory: {
          allergies: [],
          chronicConditions: ['High Cholesterol'],
          previousSurgeries: [],
          medications: ['Atorvastatin'],
          bloodGroup: 'O-',
        },
        emergencyContact: {
          name: 'Sarah Anderson',
          relationship: 'Wife',
          phone: '+1-555-1010',
        },
        status: 'Active',
      },
      {
        name: 'Emma White',
        age: 25,
        gender: 'Female',
        contactInfo: {
          phone: '+1-555-1011',
          email: 'emma.white@email.com',
          address: {
            street: '600 Cedar Ln',
            city: 'New York',
            state: 'NY',
            zipCode: '10015',
          },
        },
        medicalHistory: {
          allergies: ['Dust Mites'],
          chronicConditions: ['Seasonal Allergies'],
          previousSurgeries: [],
          medications: ['Cetirizine'],
          bloodGroup: 'A-',
        },
        emergencyContact: {
          name: 'Thomas White',
          relationship: 'Father',
          phone: '+1-555-1012',
        },
        status: 'Active',
      },
      {
        name: 'Christopher Martinez',
        age: 42,
        gender: 'Male',
        contactInfo: {
          phone: '+1-555-1013',
          email: 'chris.martinez@email.com',
          address: {
            street: '700 Birch Way',
            city: 'New York',
            state: 'NY',
            zipCode: '10016',
          },
        },
        medicalHistory: {
          allergies: ['Aspirin'],
          chronicConditions: ['GERD'],
          previousSurgeries: ['Gallbladder Removal (2015)'],
          medications: ['Omeprazole'],
          bloodGroup: 'B-',
        },
        emergencyContact: {
          name: 'Amanda Martinez',
          relationship: 'Wife',
          phone: '+1-555-1014',
        },
        status: 'Active',
      },
      {
        name: 'Sophia Thompson',
        age: 35,
        gender: 'Female',
        contactInfo: {
          phone: '+1-555-1015',
          email: 'sophia.thompson@email.com',
          address: {
            street: '800 Willow St',
            city: 'New York',
            state: 'NY',
            zipCode: '10017',
          },
        },
        medicalHistory: {
          allergies: [],
          chronicConditions: ['Migraines'],
          previousSurgeries: [],
          medications: ['Sumatriptan'],
          bloodGroup: 'O+',
        },
        emergencyContact: {
          name: 'Daniel Thompson',
          relationship: 'Husband',
          phone: '+1-555-1016',
        },
        status: 'Active',
      },
      {
        name: 'William Davis',
        age: 60,
        gender: 'Male',
        contactInfo: {
          phone: '+1-555-1017',
          email: 'william.davis@email.com',
          address: {
            street: '900 Spruce Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10018',
          },
        },
        medicalHistory: {
          allergies: ['Codeine'],
          chronicConditions: ['Heart Disease', 'Hypertension'],
          previousSurgeries: ['Bypass Surgery (2019)'],
          medications: ['Atenolol', 'Aspirin', 'Atorvastatin'],
          bloodGroup: 'A+',
        },
        emergencyContact: {
          name: 'Patricia Davis',
          relationship: 'Wife',
          phone: '+1-555-1018',
        },
        status: 'Active',
      },
      {
        name: 'Olivia Johnson',
        age: 19,
        gender: 'Female',
        contactInfo: {
          phone: '+1-555-1019',
          email: 'olivia.johnson@email.com',
          address: {
            street: '1000 Fir Rd',
            city: 'New York',
            state: 'NY',
            zipCode: '10019',
          },
        },
        medicalHistory: {
          allergies: ['Nuts'],
          chronicConditions: [],
          previousSurgeries: [],
          medications: [],
          bloodGroup: 'B+',
        },
        emergencyContact: {
          name: 'Robert Johnson',
          relationship: 'Father',
          phone: '+1-555-1020',
        },
        status: 'Active',
      },
    ];

    // Insert doctors (or get existing ones)
    console.log('\n📝 Processing doctors...');
    let insertedDoctors = [];
    for (const doctor of doctors) {
      let doc = await Doctor.findOne({ licenseNumber: doctor.licenseNumber });
      if (!doc) {
        doc = await Doctor.create(doctor);
        insertedDoctors.push(doc);
      } else {
        insertedDoctors.push(doc);
      }
    }
    console.log(`✅ ${insertedDoctors.length} doctors ready`);

    // Insert patients (or get existing ones)
    console.log('\n📝 Processing patients...');
    let insertedPatients = [];
    for (const patient of patients) {
      let pat = await Patient.findOne({ 
        name: patient.name, 
        'contactInfo.phone': patient.contactInfo.phone 
      });
      if (!pat) {
        pat = await Patient.create(patient);
        insertedPatients.push(pat);
      } else {
        insertedPatients.push(pat);
      }
    }
    console.log(`✅ ${insertedPatients.length} patients ready`);

    // Create appointments
    console.log('\n📝 Creating appointments...');
    const today = new Date();
    const appointments = [
      {
        patient: insertedPatients[0]._id, // John Smith
        doctor: insertedDoctors[0]._id, // Dr. Sarah Johnson (Cardiology)
        appointmentDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        appointmentTime: '10:00',
        duration: 30,
        status: 'Scheduled',
        reason: 'Follow-up for hypertension and diabetes management',
        notes: 'Patient needs regular monitoring',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[1]._id, // Maria Garcia
        doctor: insertedDoctors[2]._id, // Dr. Emily Rodriguez (Pediatrics)
        appointmentDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        appointmentTime: '14:00',
        duration: 30,
        status: 'Confirmed',
        reason: 'Asthma check-up',
        notes: 'Review medication effectiveness',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[2]._id, // David Lee
        doctor: insertedDoctors[3]._id, // Dr. James Wilson (Orthopedics)
        appointmentDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        appointmentTime: '11:00',
        duration: 45,
        status: 'Scheduled',
        reason: 'Post-surgery knee evaluation',
        notes: 'Check recovery progress from 2020 surgery',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[3]._id, // Jennifer Taylor
        doctor: insertedDoctors[3]._id, // Dr. James Wilson (Orthopedics)
        appointmentDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
        appointmentTime: '15:00',
        duration: 30,
        status: 'Completed',
        reason: 'Arthritis management',
        notes: 'Patient responded well to treatment',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[4]._id, // Michael Anderson
        doctor: insertedDoctors[5]._id, // Dr. Robert Brown (General Medicine)
        appointmentDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        appointmentTime: '09:00',
        duration: 30,
        status: 'Scheduled',
        reason: 'Cholesterol level review',
        notes: 'Routine check-up',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[5]._id, // Emma White
        doctor: insertedDoctors[4]._id, // Dr. Priya Patel (Dermatology)
        appointmentDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        appointmentTime: '13:00',
        duration: 30,
        status: 'Scheduled',
        reason: 'Skin allergy consultation',
        notes: 'Seasonal allergy management',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[6]._id, // Christopher Martinez
        doctor: insertedDoctors[5]._id, // Dr. Robert Brown (General Medicine)
        appointmentDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        appointmentTime: '10:30',
        duration: 30,
        status: 'Completed',
        reason: 'GERD follow-up',
        notes: 'Medication adjustment needed',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[7]._id, // Sophia Thompson
        doctor: insertedDoctors[1]._id, // Dr. Michael Chen (Neurology)
        appointmentDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
        appointmentTime: '11:30',
        duration: 45,
        status: 'Scheduled',
        reason: 'Migraine consultation',
        notes: 'Evaluate current treatment plan',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[8]._id, // William Davis
        doctor: insertedDoctors[0]._id, // Dr. Sarah Johnson (Cardiology)
        appointmentDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        appointmentTime: '14:30',
        duration: 45,
        status: 'Confirmed',
        reason: 'Heart disease monitoring',
        notes: 'Post-bypass surgery follow-up',
        createdBy: adminUser._id,
      },
      {
        patient: insertedPatients[9]._id, // Olivia Johnson
        doctor: insertedDoctors[2]._id, // Dr. Emily Rodriguez (Pediatrics)
        appointmentDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        appointmentTime: '15:30',
        duration: 30,
        status: 'Scheduled',
        reason: 'General check-up',
        notes: 'Routine examination',
        createdBy: adminUser._id,
      },
    ];

    // Insert appointments (skip if overlapping)
    let insertedAppointments = [];
    for (const apt of appointments) {
      try {
        const appointment = await Appointment.create(apt);
        insertedAppointments.push(appointment);
      } catch (error) {
        if (error.message.includes('overlaps')) {
          console.log(`⚠️  Skipped overlapping appointment for ${apt.appointmentDate.toDateString()}`);
        } else {
          throw error;
        }
      }
    }
    console.log(`✅ Created ${insertedAppointments.length} appointments`);

    // Create prescriptions
    console.log('\n📝 Creating prescriptions...');
    const prescriptions = [
      {
        patient: insertedPatients[0]._id, // John Smith
        doctor: insertedDoctors[0]._id, // Dr. Sarah Johnson
        appointment: insertedAppointments[0]?._id,
        medications: [
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with meals',
          },
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning',
          },
        ],
        diagnosis: 'Type 2 Diabetes, Hypertension',
        notes: 'Continue current medication. Monitor blood pressure weekly.',
        status: 'Active',
      },
      {
        patient: insertedPatients[1]._id, // Maria Garcia
        doctor: insertedDoctors[2]._id, // Dr. Emily Rodriguez
        appointment: insertedAppointments[1]?._id,
        medications: [
          {
            name: 'Albuterol Inhaler',
            dosage: '90mcg',
            frequency: 'As needed',
            duration: '90 days',
            instructions: 'Use 2 puffs every 4-6 hours during asthma attacks',
          },
        ],
        diagnosis: 'Asthma',
        notes: 'Patient should carry inhaler at all times.',
        status: 'Active',
      },
      {
        patient: insertedPatients[2]._id, // David Lee
        doctor: insertedDoctors[3]._id, // Dr. James Wilson
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '400mg',
            frequency: 'Three times daily',
            duration: '7 days',
            instructions: 'Take with food to avoid stomach upset',
          },
        ],
        diagnosis: 'Post-surgical knee pain',
        notes: 'Follow-up appointment scheduled for evaluation.',
        status: 'Active',
      },
      {
        patient: insertedPatients[3]._id, // Jennifer Taylor
        doctor: insertedDoctors[3]._id, // Dr. James Wilson
        appointment: insertedAppointments[3]?._id,
        medications: [
          {
            name: 'Ibuprofen',
            dosage: '600mg',
            frequency: 'Three times daily',
            duration: '14 days',
            instructions: 'Take with meals',
          },
          {
            name: 'Calcium Carbonate',
            dosage: '1000mg',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take with vitamin D supplement',
          },
        ],
        diagnosis: 'Arthritis, Osteoporosis',
        notes: 'Patient showing improvement. Continue current treatment.',
        status: 'Active',
      },
      {
        patient: insertedPatients[4]._id, // Michael Anderson
        doctor: insertedDoctors[5]._id, // Dr. Robert Brown
        medications: [
          {
            name: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take at bedtime',
          },
        ],
        diagnosis: 'Hypercholesterolemia',
        notes: 'Monitor cholesterol levels in 3 months.',
        status: 'Active',
      },
      {
        patient: insertedPatients[5]._id, // Emma White
        doctor: insertedDoctors[4]._id, // Dr. Priya Patel
        medications: [
          {
            name: 'Cetirizine',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the evening',
          },
        ],
        diagnosis: 'Seasonal Allergies',
        notes: 'Avoid known allergens. Use nasal spray if needed.',
        status: 'Active',
      },
      {
        patient: insertedPatients[6]._id, // Christopher Martinez
        doctor: insertedDoctors[5]._id, // Dr. Robert Brown
        appointment: insertedAppointments[6]?._id,
        medications: [
          {
            name: 'Omeprazole',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take 30 minutes before breakfast',
          },
        ],
        diagnosis: 'GERD (Gastroesophageal Reflux Disease)',
        notes: 'Avoid spicy foods and large meals. Elevate head while sleeping.',
        status: 'Active',
      },
      {
        patient: insertedPatients[7]._id, // Sophia Thompson
        doctor: insertedDoctors[1]._id, // Dr. Michael Chen
        medications: [
          {
            name: 'Sumatriptan',
            dosage: '50mg',
            frequency: 'As needed (max 2 per day)',
            duration: '30 days',
            instructions: 'Take at first sign of migraine',
          },
        ],
        diagnosis: 'Migraine Headaches',
        notes: 'Keep a migraine diary. Avoid triggers.',
        status: 'Active',
      },
      {
        patient: insertedPatients[8]._id, // William Davis
        doctor: insertedDoctors[0]._id, // Dr. Sarah Johnson
        appointment: insertedAppointments[8]?._id,
        medications: [
          {
            name: 'Atenolol',
            dosage: '50mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take in the morning',
          },
          {
            name: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            duration: '90 days',
            instructions: 'Take with food',
          },
          {
            name: 'Atorvastatin',
            dosage: '40mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take at bedtime',
          },
        ],
        diagnosis: 'Coronary Artery Disease, Hypertension',
        notes: 'Post-bypass surgery patient. Monitor closely.',
        followUpDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'Active',
      },
      {
        patient: insertedPatients[9]._id, // Olivia Johnson
        doctor: insertedDoctors[2]._id, // Dr. Emily Rodriguez
        medications: [
          {
            name: 'Epinephrine Auto-Injector',
            dosage: '0.3mg',
            frequency: 'As needed for severe allergic reaction',
            duration: '365 days',
            instructions: 'Carry at all times. Use immediately if exposed to nuts.',
          },
        ],
        diagnosis: 'Severe Nut Allergy',
        notes: 'Patient must carry epinephrine at all times. Educate on anaphylaxis symptoms.',
        status: 'Active',
      },
    ];

    const insertedPrescriptions = await Prescription.insertMany(prescriptions);
    console.log(`✅ Created ${insertedPrescriptions.length} prescriptions`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Doctors: ${insertedDoctors.length}`);
    console.log(`   • Patients: ${insertedPatients.length}`);
    console.log(`   • Appointments: ${insertedAppointments.length}`);
    console.log(`   • Prescriptions: ${insertedPrescriptions.length}`);
    console.log(`\n💡 You can now view this data in your application at http://localhost:3000`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();

