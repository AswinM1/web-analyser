const express = require('express');
const cors = require('cors');
const pa11y = require('pa11y');
const Groq = require('groq-sdk');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Initialize GROQ
const groq = new Groq({
  apiKey: process.env.KEY,
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Define User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Middleware
app.use(cors());
app.use(express.json());

// POST /test - Accessibility testing + AI suggestions
app.post('/test', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    // Step 1: Run accessibility test
    const results = await pa11y(url);

    const issues = results.issues.map(issue => ({
      message: issue.message,
      context: issue.context,
      selector: issue.selector,
    }));

    // Step 2: Send issues to GROQ AI
    const aiSuggestions = await getAiSuggestionsFromGroq(issues);

    // Step 3: Send results back to frontend
    res.json({ issues, aiSuggestions });

  } catch (err) {
    console.error('Error during testing:', err.message);
    res.status(500).json({ message: 'Failed to test URL accessibility' });
  }
});

// Function to send issues to GROQ and get smart suggestions
async function getAiSuggestionsFromGroq(issues) {
  const prompt = `
Given the following accessibility issues found on a webpage, generate professional suggestions on how to fix each issue.

Issues:
${issues.map((issue, index) => `${index + 1}. ${issue.message} (at selector: ${issue.selector})`).join('\n')}

Respond by providing code corrections for each error provided neat and clean no bullet points 
`;

  const response = await groq.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
    ],
    model: "llama3-8b-8192",
  });

  const aiText = response.choices[0]?.message?.content || "No AI suggestions available.";
  
  return aiText.split('\n').filter(line => line.trim() !== '');
}

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // No JWT, just a success response
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during sign-up:', err.message);
    res.status(500).json({ message: 'Server error during sign-up' });
  }
});

// POST /signin - Login user
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // No JWT, just a success response
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during sign-in:', err.message);
    res.status(500).json({ message: 'Server error during sign-in' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
