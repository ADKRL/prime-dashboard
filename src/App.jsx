import { useState, useEffect } from "react";
import { Activity, Users, Layers, Clock, CheckCircle, AlertCircle, Zap } from "lucide-react";
import "./App.css";

function App() {
  // Get coordinator API endpoint from environment or use default
  const getCoordinatorUrl = () => {
    const host = import.meta.env.VITE_COORDINATOR_HOST || 'localhost';
    const port = import.meta.env.VITE_COORDINATOR_PORT || '9000';
    return `http://${host}:${port}/api/status`;
  };

  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    activeWorkers: 0,
    deadWorkers: 0,
    totalPrimes: 0,
    queuedJobs: 0,
    assignedJobs: 0,
    snapshotsProcessed: 0,
    snapshotsFailed: 0,
    progress: 0,
    workers: [],
    activityFeed: [],
    alerts: [],
    lastUpdate: new Date(),
  });

  const [previousStats, setPreviousStats] = useState(null);
  const [coordinatorUrl] = useState(getCoordinatorUrl());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(coordinatorUrl);
        const data = await response.json();

        const newStats = {
          totalJobs: data.total_jobs,
          completedJobs: data.completed_jobs,
          activeWorkers: data.active_workers,
          deadWorkers: data.dead_workers || 0,
          totalPrimes: data.total_primes,
          queuedJobs: data.queued_jobs || 0,
          assignedJobs: data.assigned_jobs || 0,
          snapshotsProcessed: data.snapshots_processed || 0,
          snapshotsFailed: data.snapshots_failed || 0,
          progress: ((data.completed_jobs / data.total_jobs) * 100) || 0,
          workers: data.worker_ids.map((id) => ({
            id,
            status: "active",
            jobsCompleted: 0,
            lastHeartbeat: "now"
          })),
          activityFeed: stats.activityFeed,
          alerts: [],
          lastUpdate: new Date(),
        };

        // Generate alerts based on system state
        const newAlerts = [];
        if (data.dead_workers > 0) {
          newAlerts.push({
            id: `dead-${Date.now()}`,
            type: "warning",
            message: `${data.dead_workers} worker(s) dead`,
            timestamp: new Date(),
          });
        }
        if (data.queued_jobs > data.total_jobs * 0.3) {
          newAlerts.push({
            id: `queue-${Date.now()}`,
            type: "warning",
            message: `Queue building up: ${data.queued_jobs} jobs waiting`,
            timestamp: new Date(),
          });
        }
        if (previousStats && data.completed_jobs > previousStats.completedJobs) {
          newAlerts.push({
            id: `complete-${Date.now()}`,
            type: "success",
            message: `Job completed! Total primes: ${data.total_primes.toLocaleString()}`,
            timestamp: new Date(),
          });
        }

        newStats.alerts = [...newAlerts, ...stats.alerts].slice(0, 5);
        setStats(newStats);
        setPreviousStats(newStats);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats((prev) => ({
          ...prev,
          alerts: [
            {
              id: `error-${Date.now()}`,
              type: "error",
              message: "Failed to connect to API",
              timestamp: new Date(),
            },
            ...prev.alerts,
          ].slice(0, 5),
        }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <header className="header">
        <h1>🔢 Distributed Prime Number System</h1>
        <div className="status-badge">
          <Activity className="icon-spin" size={20} />
          <span>System Active</span>
        </div>
      </header>

      {/* System Alerts */}
      {stats.alerts.length > 0 && (
        <div className="alerts-section">
          <h3>System Alerts</h3>
          <div className="alerts-container">
            {stats.alerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === "success" && <CheckCircle size={18} />}
                  {alert.type === "warning" && <AlertCircle size={18} />}
                  {alert.type === "error" && <AlertCircle size={18} />}
                </div>
                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-time">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#3b82f6" }}>
            <Layers size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Jobs</p>
            <p className="stat-value">{stats.totalJobs}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#10b981" }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats.completedJobs}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#8b5cf6" }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Workers</p>
            <p className="stat-value">{stats.activeWorkers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#f59e0b" }}>
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Primes Found</p>
            <p className="stat-value">{stats.totalPrimes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Overall Progress</h3>
          <span className="progress-percentage">{stats.progress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${stats.progress}%` }} />
        </div>
        <p className="progress-text">
          {stats.completedJobs} of {stats.totalJobs} jobs completed
        </p>
        <div className="job-stats">
          <span className="job-stat">
            <strong>{stats.assignedJobs}</strong> assigned
          </span>
          <span className="job-stat">
            <strong>{stats.queuedJobs}</strong> queued
          </span>
        </div>
      </div>

      {/* Worker Health Grid */}
      <div className="workers-section">
        <h3>Worker Status</h3>
        <div className="worker-grid">
          {stats.workers.map((worker) => (
            <div key={worker.id} className="worker-card">
              <div className="worker-status-indicator active"></div>
              <p className="worker-id">{worker.id}</p>
              <p className="worker-status">Active</p>
            </div>
          ))}
          {stats.deadWorkers > 0 && (
            <div className="worker-card dead">
              <div className="worker-status-indicator dead"></div>
              <p className="worker-id">Dead Workers</p>
              <p className="worker-status">{stats.deadWorkers}</p>
            </div>
          )}
        </div>
      </div>

      {/* Snapshot Stats */}
      <div className="snapshot-section">
        <div className="snapshot-card success">
          <p className="snapshot-label">Snapshots Processed</p>
          <p className="snapshot-value">{stats.snapshotsProcessed}</p>
        </div>
        <div className="snapshot-card error">
          <p className="snapshot-label">Snapshots Failed</p>
          <p className="snapshot-value">{stats.snapshotsFailed}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
