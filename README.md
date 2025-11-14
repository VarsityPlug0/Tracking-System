# CourierIt Package Tracking System

A modern package tracking application with admin panel for managing tracking numbers and statuses.

## Features

- **Modern Tracking Interface**: Clean, responsive UI for customers to track their packages
- **Video Background**: Dynamic video background showcasing logistics operations
- **Admin Panel**: Comprehensive dashboard for managing tracking numbers and package statuses
- **Real-time Tracking**: View package status, location, and delivery history
- **Package Management**: Create, update, and delete tracking entries
- **Status Updates**: Add new events and notes to tracking records

## Project Structure

```
.
├── modern-tracking.html     # Main tracking page with video background
├── admin-panel.html         # Admin dashboard for managing packages
├── server.js               # Express server with all API endpoints
├── Logo.mp4                # Video background for tracking page
├── package.json            # Project dependencies and scripts
└── Tracking _ UPS - United States_files/  # Legacy UPS tracking assets
```

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd Tracking
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Or start the production server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to:
   - Tracking Page: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## API Endpoints

### Tracking
- `POST /api/track` - Get tracking information for a package
- `GET /api/tracking-numbers` - Get all tracking numbers (admin)
- `POST /api/generate-tracking` - Generate a new tracking number (admin)
- `PUT /api/update-tracking` - Update tracking information (admin)
- `DELETE /api/tracking-numbers/:trackingNumber` - Delete a tracking number (admin)

## Development

### Project Components

1. **Frontend**:
   - Modern tracking page with video background
   - Admin dashboard with management interface
   - Responsive design for all devices

2. **Backend**:
   - Express.js server
   - In-memory storage (would use database in production)
   - RESTful API endpoints

3. **Assets**:
   - Logo.mp4 - Video background for tracking page
   - UPS legacy files for compatibility

### Scripts

- `npm start` - Run the production server
- `npm run dev` - Run the development server with nodemon

## Security Considerations

- All sensitive files are excluded via .gitignore
- No environment variables are committed to the repository
- Admin panel should be protected with authentication in production

## License

This project is licensed under the MIT License.