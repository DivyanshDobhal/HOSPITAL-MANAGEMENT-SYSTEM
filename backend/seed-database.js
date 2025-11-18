// Script to seed database with sample doctors and patients
require('dotenv').config();
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await Doctor.deleteMany({});
    // await Patient.deleteMany({});
    // console.log('🗑️  Cleared existing data');

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

    // Insert doctors
    console.log('\n📝 Adding doctors...');
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ Added ${insertedDoctors.length} doctors`);

    // Insert patients
    console.log('\n📝 Adding patients...');
    const insertedPatients = await Patient.insertMany(patients);
    console.log(`✅ Added ${insertedPatients.length} patients`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   • Doctors: ${insertedDoctors.length}`);
    console.log(`   • Patients: ${insertedPatients.length}`);
    console.log(`\n💡 You can now view this data in your application at http://localhost:3000`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    if (error.code === 11000) {
      console.log('\n💡 Some records already exist. The script will skip duplicates.');
      console.log('   To replace existing data, uncomment the deleteMany lines in the script.');
    }
    process.exit(1);
  }
};

seedDatabase();

