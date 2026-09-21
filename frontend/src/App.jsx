import { useState } from "react";
import {
  LayoutDashboard,
  ScanSearch,
  Cpu,
  BarChart3,
  Settings,
  Upload,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  Zap,
} from "lucide-react";
import "./index.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [selectedFile, setSelectedFile] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Inspect Image", icon: ScanSearch },
    { name: "Models", icon: Cpu },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setActivePage("Inspect Image");
    }
  };

  const renderDashboard = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Industrial Inspection Dashboard</h1>
          <p>
            Edge-optimized AI system for real-time industrial defect detection
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          Online
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <ScanSearch size={22} />
          </div>
          <div>
            <span>Total Inspections</span>
            <h2> </h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span>Defect-Free</span>
            <h2> </h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span>Defects Detected</span>
            <h2> </h2>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock3 size={22} />
          </div>
          <div>
            <span>Avg. Latency</span>
            <h2> ms</h2>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Quick Inspection</h3>
              <p>Upload an industrial product image</p>
            </div>

            <ScanSearch size={22} />
          </div>

          <label className="upload-box">
            <Upload size={40} />
            <h3>Upload Inspection Image</h3>
            <p>PNG, JPG or JPEG</p>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Model Status</h3>
              <p>Current AI pipeline</p>
            </div>

            <Activity size={22} />
          </div>

          <div className="model-list">
            <ModelStatus name="MobileNet / EfficientNet-Lite" status="Ready" />
            <ModelStatus name="YOLOv8 Detector" status="Ready" />
            <ModelStatus name="SVM / Random Forest / XGBoost" status="Ready" />
            <ModelStatus name="Autoencoder Anomaly Detector" status="Ready" />
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Detection Performance</h3>
            <p>Current system evaluation metrics</p>
          </div>

          <BarChart3 size={22} />
        </div>

        <div className="performance-grid">
          <PerformanceItem label="Precision" value="X%" />
          <PerformanceItem label="Recall" value="X%" />
          <PerformanceItem label="F1 Score" value="X%" />
          <PerformanceItem label="mAP" value="X%" />
          <PerformanceItem label="FPS" value="X" />
          <PerformanceItem label="Memory Usage" value="X GB" />
        </div>
      </div>
    </>
  );

  const renderInspection = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Inspect Image</h1>
          <p>Run industrial defect detection on a product image</p>
        </div>
      </div>

      <div className="inspection-layout">
        <div className="panel inspection-upload">
          <h3>Input Image</h3>

          {!selectedFile ? (
            <label className="large-upload-box">
              <Upload size={48} />
              <h3>Select Product Image</h3>
              <p>Upload a PNG, JPG or JPEG image</p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="selected-file">
              <CheckCircle2 size={24} />
              <div>
                <strong>{selectedFile.name}</strong>
                <p>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <button className="primary-button">
            <Zap size={18} />
            Run Detection
          </button>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Detection Result</h3>
              <p>Model output will appear here</p>
            </div>
          </div>

          <div className="result-placeholder">
            <ScanSearch size={50} />
            <h3>No inspection yet</h3>
            <p>
              Upload an image and run detection to view defect results.
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderModels = () => (
    <>
      <div className="page-header">
        <div>
          <h1>AI Models</h1>
          <p>Models used in the hybrid defect detection framework</p>
        </div>
      </div>

      <div className="models-grid">
        <ModelCard
          title="Lightweight CNN"
          model="MobileNet / EfficientNet-Lite"
          purpose="Feature extraction"
        />

        <ModelCard
          title="YOLOv8"
          model="Lightweight YOLOv8"
          purpose="Defect detection & localization"
        />

        <ModelCard
          title="ML Classifier"
          model="SVM / Random Forest / XGBoost"
          purpose="Defect classification"
        />

        <ModelCard
          title="Autoencoder"
          model="Small Autoencoder"
          purpose="Unknown defect detection"
        />
      </div>
    </>
  );

  const renderReports = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Reports & Metrics</h1>
          <p>Inspection and model performance analysis</p>
        </div>
      </div>

      <div className="panel">
        <div className="report-table">
          <div className="table-row table-header">
            <span>Metric</span>
            <span>Value</span>
            <span>Status</span>
          </div>

          <ReportRow name="Precision" value="X%" />
          <ReportRow name="Recall" value="X%" />
          <ReportRow name="F1 Score" value="X%" />
          <ReportRow name="mAP" value="X%" />
          <ReportRow name="Inference Latency" value=" ms" />
          <ReportRow name="FPS" value="X" />
          <ReportRow name="Memory Usage" value="X GB" />
        </div>
      </div>
    </>
  );

  const renderSettings = () => (
    <>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Inspection system configuration</p>
        </div>
      </div>

      <div className="panel settings-panel">
        <h3>System Configuration</h3>

        <div className="setting-row">
          <div>
            <strong>Detection Mode</strong>
            <p>Real-time industrial inspection</p>
          </div>
          <span className="setting-value">Enabled</span>
        </div>

        <div className="setting-row">
          <div>
            <strong>Edge Optimization</strong>
            <p>Low latency and reduced memory usage</p>
          </div>
          <span className="setting-value">Enabled</span>
        </div>

        <div className="setting-row">
          <div>
            <strong>YOLOv8 Detector</strong>
            <p>Primary object detection model</p>
          </div>
          <span className="setting-value">Ready</span>
        </div>
      </div>
    </>
  );

  const renderPage = () => {
    switch (activePage) {
      case "Inspect Image":
        return renderInspection();

      case "Models":
        return renderModels();

      case "Reports":
        return renderReports();

      case "Settings":
        return renderSettings();

      default:
        return renderDashboard();
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Cpu size={25} />
          </div>

          <div>
            <h2>DefectAI</h2>
            <span>Industrial Vision</span>
          </div>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="edge-status">
            <span className="status-dot"></span>
            <div>
              <strong>Edge Device</strong>
              <small>Connected</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">

          <span>Real-Time Industrial Inspection</span>
        </header>

        <section className="content">{renderPage()}</section>
      </main>
    </div>
  );
}

function ModelStatus({ name, status }) {
  return (
    <div className="model-status">
      <div>
        <strong>{name}</strong>
      </div>

      <span className="ready-badge">
        <span className="status-dot"></span>
        {status}
      </span>
    </div>
  );
}

function PerformanceItem({ label, value }) {
  return (
    <div className="performance-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModelCard({ title, model, purpose }) {
  return (
    <div className="panel model-card">
      <div className="model-card-icon">
        <Cpu size={25} />
      </div>

      <h3>{title}</h3>

      <span className="model-name">{model}</span>

      <p>{purpose}</p>

      <div className="model-ready">
        <span className="status-dot"></span>
        Ready
      </div>
    </div>
  );
}

function ReportRow({ name, value }) {
  return (
    <div className="table-row">
      <span>{name}</span>
      <strong>{value}</strong>
      <span className="ready-badge">
        <span className="status-dot"></span>
        Available
      </span>
    </div>
  );
}

export default App;