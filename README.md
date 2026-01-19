# Prime Dashboard

A real-time monitoring dashboard for the Prime Number Distributed System. This React + Vite application displays live statistics about workers, jobs, and prime number discoveries.

## Features

- 📊 Real-time job and worker monitoring
- 🔢 Live prime number count tracking
- ⚠️ System alerts and notifications
- 📈 Visual charts and statistics
- 🔄 Auto-refresh capabilities

## Prerequisites

Before running this project, ensure you have:

- **Node.js** - v20.19+ or v22.12+ ([Download Node.js](https://nodejs.org/))
- **npm** - Comes with Node.js
- **Prime Coordinator** - Running locally or accessible via network

## Getting Started

### 1. Clone and Install

```bash
# Navigate to the project directory
cd prime-dashboard

# Install dependencies
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root with your coordinator connection details:

```env
VITE_COORDINATOR_HOST=localhost
VITE_COORDINATOR_PORT=9000
```

**For remote coordinator or Ngrok tunnel:**
```env
VITE_COORDINATOR_HOST=your-ngrok-url.ngrok-free.dev
VITE_COORDINATOR_PORT=443
```

### 3. Run the Development Server

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Running the Project

### Local Development

1. **Start your Prime Coordinator:**
   ```bash
   # In a separate terminal
   cd /path/to/prime-coordinator
   ./bin/coordinator -config configs/config.yaml
   ```

2. **Start the dashboard:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Production Build

```bash
# Build the application
npm run build

# Preview the build
npm run preview
```

## Project Structure

```
prime-dashboard/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and icons
│   ├── App.jsx      # Main dashboard component
│   ├── App.css      # Dashboard styles
│   ├── main.jsx     # Application entry point
│   └── index.css    # Global styles
├── .env             # Environment variables (create this)
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## Troubleshooting

### Dashboard shows connection errors

**Problem:** "Failed to connect to API" or similar errors

**Solutions:**
1. Verify the coordinator is running: `curl http://localhost:9000/status`
2. Check `.env` file has correct `VITE_COORDINATOR_HOST` and `VITE_COORDINATOR_PORT`
3. Restart the dev server after changing `.env`: Stop with `Ctrl+C`, then `npm run dev`

### Port 5173 is already in use

**Problem:** Another process is using port 5173

**Solution:**
```bash
# Kill the process on port 5173 (Mac/Linux)
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies installation fails

**Problem:** `npm install` errors

**Solutions:**
1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`: `rm -rf node_modules package-lock.json`
3. Reinstall: `npm install`

## Tech Stack

- **React 19.1** - UI framework
- **Vite 7.1** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **Recharts** - Charting library
- **Lucide React** - Icon library

## Deployment

For production deployment instructions (Netlify, Ngrok, etc.), see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Contributing

1. Follow the existing code style
2. Run `npm run lint` before committing
3. Test all changes locally with `npm run dev`

## License

This project is part of a distributed systems coursework.
