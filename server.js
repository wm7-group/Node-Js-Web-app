const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Store form submissions in memory (temporary array)
let formSubmissions = [];

// Middleware - THIS ORDER IS IMPORTANT!
app.use(express.static('public')); // Serve static files from public folder
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON data

// Routes
// GET route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route to handle form submission
app.post('/submit-contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // Basic server-side validation
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }
    
    // Create submission object
    const submission = {
        id: Date.now(),
        name: name,
        email: email,
        message: message,
        timestamp: new Date().toISOString()
    };
    
    // Add to temporary storage
    formSubmissions.push(submission);
    
    // Log to console
    console.log('New Contact Form Submission:');
    console.log('----------------------------');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${submission.timestamp}`);
    console.log('----------------------------\n');
    
    // Redirect to thank you page
    res.redirect('/thank-you.html');
});

// GET route to view all submissions (bonus feature)
app.get('/admin/submissions', (req, res) => {
    res.json({
        total: formSubmissions.length,
        submissions: formSubmissions
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin/submissions`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});