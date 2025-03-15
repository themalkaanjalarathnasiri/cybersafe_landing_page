const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Store demo requests in memory (in a real app, this would use a database)
const demoRequests = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/submit-demo', (req, res) => {
  const { name, company, email, reason, contact_preference } = req.body;
  
  // Log the submission
  console.log(`Demo request from ${name} at ${company}`);
  
  // Store the request
  demoRequests.push({
    name,
    company,
    email,
    reason,
    contact_preference,
    date: new Date()
  });
  
  // In a real-world scenario, you might send an email notification here
  
  // Return JSON response
  res.json({
    success: true,
    message: 'Your demo request has been submitted successfully! We will contact you soon.'
  });
});

// For debugging - view all submissions
app.get('/admin/submissions', (req, res) => {
  res.json(demoRequests);
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});