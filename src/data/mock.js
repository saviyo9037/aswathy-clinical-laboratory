// Fictional demo data only. Reference ranges are illustrative, NOT clinically approved.
export const TODAY = '2026-11-18';

const p = (name, unit, low, high) => ({ name, unit, low, high });

export const initialTests = [
  { id: 'T01', code: 'CBC', name: 'CBC', fullName: 'Complete Blood Count', category: 'Haematology', sample: 'EDTA Blood', params: [
    p('Haemoglobin', 'g/dL', 12, 16), p('Total WBC Count', 'cells/uL', 4000, 11000), p('RBC Count', 'million/uL', 4.2, 5.4),
    p('Platelet Count', 'lakh/uL', 1.5, 4.1), p('PCV / Haematocrit', '%', 36, 46), p('MCV', 'fL', 80, 100),
  ] },
  { id: 'T02', code: 'LIPID', name: 'Lipid Profile', fullName: 'Lipid Profile', category: 'Biochemistry', sample: 'Serum (Fasting)', params: [
    p('Total : Cholesterol', 'mg/dl', 150, 200), p('Triglycerides', 'mg/dl', 50, 185), p('HDL Cholesterol', 'mg/dl', 30, 60),
    p('LDL Cholesterol', 'mg/dl', 60, 100), p('VLDL Cholesterol', 'mg/dl', 10, 40),
  ] },
  { id: 'T03', code: 'GLU', name: 'Blood Sugar', fullName: 'Blood Glucose (Fasting / Post-Prandial)', category: 'Biochemistry', sample: 'Plasma', params: [
    p('Fasting Blood Sugar', 'mg/dL', 70, 100), p('Post-Prandial Blood Sugar', 'mg/dL', 70, 140),
  ] },
  { id: 'T04', code: 'LFT', name: 'LFT', fullName: 'Liver Function Test', category: 'Biochemistry', sample: 'Serum', params: [
    p('Total Bilirubin', 'mg/dL', 0.2, 1.2), p('SGOT (AST)', 'U/L', 5, 40), p('SGPT (ALT)', 'U/L', 5, 41),
    p('Alkaline Phosphatase', 'U/L', 44, 147), p('Total Protein', 'g/dL', 6.0, 8.3), p('Albumin', 'g/dL', 3.5, 5.0),
  ] },
  { id: 'T05', code: 'KFT', name: 'KFT', fullName: 'Kidney Function Test', category: 'Biochemistry', sample: 'Serum', params: [
    p('Blood Urea', 'mg/dL', 15, 40), p('Serum Creatinine', 'mg/dL', 0.6, 1.3), p('Uric Acid', 'mg/dL', 3.5, 7.2),
    p('Sodium', 'mmol/L', 135, 145), p('Potassium', 'mmol/L', 3.5, 5.1),
  ] },
  { id: 'T06', code: 'THY', name: 'Thyroid Profile', fullName: 'Thyroid Profile (T3, T4, TSH)', category: 'Hormones', sample: 'Serum', params: [
    p('T3 (Total)', 'ng/dL', 80, 200), p('T4 (Total)', 'ug/dL', 5.1, 14.1), p('TSH', 'uIU/mL', 0.4, 4.2),
  ] },
  { id: 'T07', code: 'HB', name: 'Hemoglobin', fullName: 'Haemoglobin Estimation', category: 'Haematology', sample: 'EDTA Blood', params: [
    p('Haemoglobin', 'g/dL', 12, 16),
  ] },
  { id: 'T08', code: 'ESR', name: 'ESR', fullName: 'Erythrocyte Sedimentation Rate', category: 'Haematology', sample: 'EDTA Blood', params: [
    p('ESR (1st hour)', 'mm/hr', 0, 20),
  ] },
];

export const initialPatients = [
  { id: 'ACL-1001', name: 'Nadeera', age: 62, gender: 'Female', phone: '9847012345', address: '12/B Lotus Gardens, Kochi', registered: '2026-02-18' },
  { id: 'ACL-1002', name: 'Arjun Menon', age: 45, gender: 'Male', phone: '9946098765', address: 'Kaippilly House, Thrissur', registered: '2026-03-04' },
  { id: 'ACL-1003', name: 'Sreelakshmi K', age: 29, gender: 'Female', phone: '9895123456', address: 'Rose Villa, Aluva', registered: '2026-04-11' },
  { id: 'ACL-1004', name: 'Mohammed Faisal', age: 52, gender: 'Male', phone: '9744556677', address: 'Marine Drive Apartments, Kochi', registered: '2026-05-02' },
  { id: 'ACL-1005', name: 'Anitha Joseph', age: 61, gender: 'Female', phone: '9961234567', address: 'St. Mary Lane, Kottayam', registered: '2026-05-20' },
  { id: 'ACL-1006', name: 'Vishnu Prasad', age: 38, gender: 'Male', phone: '9037889900', address: 'Temple Road, Ernakulam', registered: '2026-07-08' },
  { id: 'ACL-1007', name: 'Divya Nair', age: 26, gender: 'Female', phone: '9526771122', address: 'Skyline Residency, Kakkanad', registered: '2026-08-14' },
  { id: 'ACL-1008', name: 'George Thomas', age: 67, gender: 'Male', phone: '9400334455', address: 'Hill View, Muvattupuzha', registered: '2026-09-09' },
  { id: 'ACL-1009', name: 'Fathima Beevi', age: 41, gender: 'Female', phone: '9656001122', address: 'Canal Road, Perumbavoor', registered: '2026-10-21' },
  { id: 'ACL-1010', name: 'Rahul Krishnan', age: 33, gender: 'Male', phone: '9747889911', address: 'Green Park, Edappally', registered: '2026-11-18' },
];

const findTest = (id) => initialTests.find((t) => t.id === id);

// values: array aligned with the test's params
const mk = (id, patientId, testId, date, values) => {
  const t = findTest(testId);
  return {
    id, patientId, testId, testName: t.name, category: t.category, date, status: 'Final',
    results: t.params.map((pa, i) => ({ ...pa, value: String(values[i]) })),
  };
};

export const initialReports = [
  mk('RPT-2001', 'ACL-1001', 'T03', '2026-06-18', [94, 128]),
  mk('RPT-2002', 'ACL-1001', 'T01', '2026-02-18', [11.4, 7200, 4.5, 2.6, 35, 84]),
  mk('RPT-2003', 'ACL-1001', 'T02', '2026-11-18', [152, 97, 46, 87, 19]),
  mk('RPT-2004', 'ACL-1002', 'T02', '2026-11-12', [238, 196, 38, 160, 39]),
  mk('RPT-2005', 'ACL-1002', 'T03', '2026-08-03', [118, 176]),
  mk('RPT-2006', 'ACL-1003', 'T06', '2026-11-18', [118, 8.2, 2.4]),
  mk('RPT-2007', 'ACL-1003', 'T01', '2026-04-11', [12.6, 6800, 4.4, 2.9, 38, 86]),
  mk('RPT-2008', 'ACL-1004', 'T04', '2026-11-17', [1.0, 46, 52, 98, 7.1, 4.2]),
  mk('RPT-2009', 'ACL-1004', 'T05', '2026-05-02', [28, 1.0, 5.4, 140, 4.3]),
  mk('RPT-2010', 'ACL-1005', 'T05', '2026-11-18', [46, 1.5, 6.8, 141, 4.6]),
  mk('RPT-2011', 'ACL-1005', 'T03', '2026-09-20', [112, 188]),
  mk('RPT-2012', 'ACL-1006', 'T08', '2026-11-16', [14]),
  mk('RPT-2013', 'ACL-1007', 'T07', '2026-11-18', [10.8]),
  mk('RPT-2014', 'ACL-1008', 'T02', '2026-11-10', [196, 142, 46, 112, 28]),
  mk('RPT-2015', 'ACL-1009', 'T01', '2026-10-21', [13.1, 7400, 4.7, 2.8, 40, 90]),
  mk('RPT-2016', 'ACL-1010', 'T03', '2026-11-18', [88, 122]),
];

// Samples collected, waiting for result entry
export const initialPending = [
  { id: 'PND-1', patientId: 'ACL-1010', testId: 'T01', date: '2026-11-18' },
  { id: 'PND-2', patientId: 'ACL-1009', testId: 'T06', date: '2026-11-18' },
  { id: 'PND-3', patientId: 'ACL-1006', testId: 'T04', date: '2026-11-18' },
];

export const initialSettings = {
  labName: 'ASWATHY COMPUTERISED CLINICAL LABORATORY',
  address: 'OPP.Telephone Exchange, Yendayar',
  phone: '6282036963, 9744592400',
  email: 'aswathyclinicydr@gmail.com',
  signatureName: 'Lab Technician',
  signatureTitle: '',
  footer: '',
};

export const notifications = [
  { id: 1, text: '3 reports are pending result entry', time: '5 min ago' },
  { id: 2, text: 'Report RPT-2013 is ready to share', time: '32 min ago' },
  { id: 3, text: 'New patient registered: Rahul Krishnan', time: '1 hr ago' },
];
