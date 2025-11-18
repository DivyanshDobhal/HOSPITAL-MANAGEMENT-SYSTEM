# 🗄️ MongoDB Advanced Features Implementation

This document describes all the advanced MongoDB features implemented in the Hospital Management System.

## 📊 Aggregation Pipelines

### 1. Dashboard Statistics
**Endpoint:** `GET /api/analytics/dashboard`

**Features:**
- Patient statistics by status
- Age distribution using `$bucket`
- Gender distribution
- Doctor statistics by specialty
- Appointment trends over time
- Monthly appointment trends
- Top medications prescribed
- Most active patients

**Example Query:**
```javascript
Patient.aggregate([
  {
    $bucket: {
      groupBy: '$age',
      boundaries: [0, 18, 30, 45, 60, 100],
      default: '100+',
      output: {
        count: { $sum: 1 },
        avgAge: { $avg: '$age' },
      },
    },
  },
])
```

### 2. Patient Analytics
**Endpoint:** `GET /api/analytics/patients`

**Features:**
- Registration trends over time
- Blood group statistics
- Chronic conditions analysis
- Patients by city/location
- Custom date range filtering

**Aggregation Operations:**
- `$group` - Grouping data
- `$unwind` - Unwinding arrays
- `$match` - Filtering
- `$sort` - Sorting results
- `$project` - Shaping output

### 3. Appointment Analytics
**Endpoint:** `GET /api/analytics/appointments`

**Features:**
- Appointments by doctor with lookup
- Average duration by specialty
- Completion rate calculations
- Busiest time slots
- Doctor utilization metrics

**Advanced Operations:**
- `$lookup` - Joining collections
- `$facet` - Multiple pipelines
- `$cond` - Conditional logic
- `$sum` with conditions

## 🔍 Advanced Search & Filtering

### Text Search
- Full-text search using MongoDB text indexes
- Regex-based search for partial matches
- Multi-field search (name, phone, email)

**Implementation:**
```javascript
// Text index created on Patient model
patientSchema.index({ name: 'text', 'contactInfo.phone': 'text' });

// Usage
query.$or = [
  { name: { $regex: search, $options: 'i' } },
  { $text: { $search: search } },
];
```

### Advanced Filtering
- Age range filtering (`$gte`, `$lte`)
- Multiple status filters
- Nested field filtering (address.city, medicalHistory.bloodGroup)
- Date range queries

### Sorting
- Multi-field sorting
- Dynamic sort field selection
- Ascending/descending order
- Sort validation

## 📈 Indexing Strategy

### Patient Indexes
```javascript
// Text search index
{ name: 'text', 'contactInfo.phone': 'text', 'contactInfo.email': 'text' }

// Query optimization indexes
{ status: 1, createdAt: -1 }
{ age: 1 }
{ gender: 1 }
{ 'contactInfo.address.city': 1 }
{ 'medicalHistory.bloodGroup': 1 }
{ createdAt: -1 }
```

### Appointment Indexes
```javascript
// Compound indexes for queries
{ doctor: 1, appointmentDate: 1, appointmentTime: 1 }
{ patient: 1, appointmentDate: -1 }
{ status: 1, appointmentDate: 1 }
{ appointmentDate: 1, status: 1 }
{ doctor: 1, status: 1, appointmentDate: 1 }
```

## 📄 Pagination

### Implementation
- Skip/limit pagination
- Total count calculation
- Page number calculation
- Efficient with indexes

**Example:**
```javascript
const skip = (parseInt(page) - 1) * parseInt(limit);
const patients = await Patient.find(query)
  .sort(sortOptions)
  .skip(skip)
  .limit(parseInt(limit));
```

## 📤 Data Export

### CSV Export
**Endpoints:**
- `GET /api/export/patients?format=csv`
- `GET /api/export/appointments?format=csv`
- `GET /api/export/report?format=json`

**Features:**
- CSV generation with headers
- JSON export option
- Date range filtering
- Custom field selection

## 🔄 Aggregation Operations Used

### 1. `$group`
Groups documents by specified field and performs calculations.

### 2. `$match`
Filters documents (like WHERE in SQL).

### 3. `$lookup`
Performs left outer join with another collection.

### 4. `$unwind`
Deconstructs an array field.

### 5. `$bucket`
Categorizes documents into buckets.

### 6. `$facet`
Runs multiple aggregation pipelines.

### 7. `$project`
Reshapes documents.

### 8. `$sort`
Sorts documents.

### 9. `$limit`
Limits number of documents.

### 10. `$sum`, `$avg`, `$min`, `$max`
Mathematical operations.

## 🎯 Performance Optimizations

### 1. Index Usage
- All frequently queried fields are indexed
- Compound indexes for multi-field queries
- Text indexes for search

### 2. Lean Queries
- Using `.lean()` for read-only operations
- Reduces memory usage
- Faster query execution

### 3. Projection
- Selecting only needed fields
- Reducing data transfer

### 4. Aggregation Optimization
- Early `$match` stages
- Index usage in pipelines
- Limiting results early

## 📊 Analytics Features

### Real-time Statistics
- Dashboard stats
- Patient demographics
- Appointment trends
- Doctor performance

### Custom Reports
- Date range filtering
- Grouped data
- Aggregated metrics
- Exportable formats

## 🔐 Security Considerations

### Query Validation
- Input sanitization
- Type checking
- Range validation
- Injection prevention

### Access Control
- Role-based filtering
- User-specific data
- Protected endpoints

## 📝 Usage Examples

### Get Patient Statistics
```javascript
GET /api/analytics/dashboard
```

### Get Patients with Aggregation
```javascript
GET /api/patients?aggregate=stats
GET /api/patients?aggregate=ageDistribution
GET /api/patients?aggregate=chronicConditions
```

### Advanced Filtering
```javascript
GET /api/patients?status=Active&gender=Male&minAge=18&maxAge=65&sortBy=age&sortOrder=asc
```

### Export Data
```javascript
GET /api/export/patients?format=csv&startDate=2024-01-01&endDate=2024-12-31
```

## 🚀 Best Practices

1. **Use Indexes**: Always index frequently queried fields
2. **Limit Results**: Use pagination for large datasets
3. **Project Fields**: Select only needed fields
4. **Optimize Aggregations**: Place `$match` early in pipeline
5. **Monitor Performance**: Use `explain()` to analyze queries
6. **Cache Results**: Cache frequently accessed analytics

## 📚 MongoDB Features Used

✅ Aggregation Pipelines
✅ Text Search
✅ Indexing (Single, Compound, Text)
✅ Sorting & Filtering
✅ Pagination
✅ Data Export
✅ Lookup Operations
✅ Bucket Operations
✅ Facet Operations
✅ Mathematical Operations
✅ Date Operations
✅ Array Operations

---

**Your Hospital Management System now has full MongoDB database capabilities!** 🎉

