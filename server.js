import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Very important: Add a handler to let Replit know your port is ready
app.use((req, res, next) => {
  res.setHeader('X-Replit-Port-Ready', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});