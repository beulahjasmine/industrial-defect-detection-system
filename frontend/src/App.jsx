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
  RotateCcw,
  Download,
  Trash2,
  Search,
  ShieldCheck,
  Gauge,
} from "lucide-react";

import "./index.css";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [confidenceThreshold, setConfidenceThreshold] = useState(50);
  const [detectionMode, setDetectionMode] = useState("Real-Time");

  // ============================
  // NAVIGATION
  // ============================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inspect Image",
      icon: ScanSearch,
    },
    {
      name: "Models",
      icon: Cpu,
    },
    {
      name: "Reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  // ============================
  // IMAGE UPLOAD
  // ============================

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedFile(file);

    setPreview(URL.createObjectURL(file));

    setResult(null);

    setActivePage("Inspect Image");
  };

  // ============================
  // RUN DETECTION
  // ============================

  const runDetection = () => {
    if (!selectedFile) {
      alert("Please upload an inspection image first.");
      return;
    }

    setIsDetecting(true);
    setResult(null);

    // Simulated AI processing
    setTimeout(() => {
      const defectDetected = Math.random() > 0.35;

      const confidence = defectDetected
        ? (88 + Math.random() * 10).toFixed(1)
        : (95 + Math.random() * 4).toFixed(1);

      const latency = Math.floor(35 + Math.random() * 20);

      const defectTypes = [
        "Surface Crack",
        "Scratch",
        "Surface Dent",
      ];

      const randomDefect =
        defectTypes[
          Math.floor(Math.random() * defectTypes.length)
        ];

      const detectionResult = {
        id: Date.now(),

        defect: defectDetected
          ? randomDefect
          : "No Defect",

        confidence: Number(confidence),

        latency,

        status: defectDetected
          ? "Defect Detected"
          : "Defect-Free",

        image: preview,

        fileName: selectedFile.name,

        time: new Date().toLocaleTimeString(),

        date: new Date().toLocaleDateString(),
      };

      setResult(detectionResult);

      setHistory((previous) => [
        detectionResult,
        ...previous,
      ]);

      setIsDetecting(false);
    }, 1500);
  };

  // ============================
  // RESET INSPECTION
  // ============================

  const resetInspection = () => {
    setSelectedFile(null);

    setPreview(null);

    setResult(null);

    setIsDetecting(false);
  };

  // ============================
  // STATISTICS
  // ============================

  const totalInspections = history.length;

  const defectsDetected = history.filter(
    (item) =>
      item.status === "Defect Detected"
  ).length;

  const defectFree = history.filter(
    (item) =>
      item.status === "Defect-Free"
  ).length;

  const averageLatency =
    totalInspections === 0
      ? 0
      : Math.round(
          history.reduce(
            (sum, item) =>
              sum + item.latency,
            0
          ) / totalInspections
        );

  const defectRate =
    totalInspections === 0
      ? 0
      : (
          (defectsDetected /
            totalInspections) *
          100
        ).toFixed(1);

  const passRate =
    totalInspections === 0
      ? 0
      : (
          (defectFree /
            totalInspections) *
          100
        ).toFixed(1);

  // ============================
  // FILTER HISTORY
  // ============================

  const filteredHistory =
    history.filter((item) => {

      const matchesSearch =
        item.fileName
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        item.defect
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      const matchesFilter =
        filterStatus === "All" ||
        (
          filterStatus === "Defect" &&
          item.status ===
            "Defect Detected"
        ) ||
        (
          filterStatus === "Passed" &&
          item.status ===
            "Defect-Free"
        );

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  // ============================
  // EXPORT CSV
  // ============================

  const exportCSV = () => {

    if (history.length === 0) {
      alert("No inspection data available.");
      return;
    }

    const headers = [
      "File Name",
      "Result",
      "Confidence",
      "Latency (ms)",
      "Date",
      "Time",
    ];

    const rows = history.map(
      (item) => [
        item.fileName,
        item.defect,
        `${item.confidence}%`,
        item.latency,
        item.date,
        item.time,
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${value}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "industrial-inspection-report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ============================
  // CLEAR HISTORY
  // ============================

  const clearHistory = () => {

    if (history.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        "Clear all inspection history?"
      );

    if (confirmed) {
      setHistory([]);

      setResult(null);
    }
  };

  // ============================
  // DASHBOARD
  // ============================

  const renderDashboard = () => (
    <>
      <div className="page-header">

        <div>

          <h1>
            Industrial Inspection Dashboard
          </h1>

          <p>
            Edge-optimized AI system for
            real-time industrial defect detection
          </p>

        </div>

        <div className="system-status">

          <span className="status-dot"></span>

          System

        </div>

      </div>


      {/* METRICS */}

      <div className="metrics-grid">

        <MetricCard
          icon={
            <ScanSearch size={22} />
          }
          title="Total Inspections"
          value={totalInspections}
        />

        <MetricCard
          icon={
            <AlertTriangle size={22} />
          }
          title="Defects Detected"
          value={defectsDetected}
        />

        <MetricCard
          icon={
            <CheckCircle2 size={22} />
          }
          title="Defect-Free"
          value={defectFree}
        />

        <MetricCard
          icon={
            <Clock3 size={22} />
          }
          title="Avg. Latency"
          value={`${averageLatency} ms`}
        />

      </div>


      {/* SECONDARY METRICS */}

      <div className="rate-grid">

        <div className="rate-card">

          <div>

            <span>
              Defect Rate
            </span>

            <strong>
              {defectRate}%
            </strong>

          </div>

          <AlertTriangle size={25} />

        </div>


        <div className="rate-card">

          <div>

            <span>
              Pass Rate
            </span>

            <strong>
              {passRate}%
            </strong>

          </div>

          <ShieldCheck size={25} />

        </div>


        <div className="rate-card">

          <div>

            <span>
              Detection Mode
            </span>

            <strong>
              {detectionMode}
            </strong>

          </div>

          <Gauge size={25} />

        </div>

      </div>


      {/* QUICK INSPECTION */}

      <div className="dashboard-grid">


        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Quick Inspection
              </h3>

              <p>
                Upload an industrial product image
              </p>

            </div>

            <ScanSearch size={22} />

          </div>


          <label className="upload-box">

            <Upload size={40} />

            <h3>
              Upload Inspection Image
            </h3>

            <p>
              PNG, JPG or JPEG
            </p>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={
                handleFileChange
              }
            />

          </label>

        </div>


        {/* LATEST DETECTION */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Latest Detection
              </h3>

              <p>
                Most recent inspection result
              </p>

            </div>

            <Activity size={22} />

          </div>


          {!result ? (

            <div className="result-placeholder">

              <ScanSearch size={45} />

              <h3>
                No inspection yet
              </h3>

              <p>
                Upload an image and run
                detection to view the result.
              </p>

            </div>

          ) : (

            <LatestResult
              result={result}
            />

          )}

        </div>

      </div>


      {/* HISTORY */}

      <HistoryPanel
        history={history}
        filteredHistory={
          filteredHistory
        }
        searchTerm={
          searchTerm
        }
        setSearchTerm={
          setSearchTerm
        }
        filterStatus={
          filterStatus
        }
        setFilterStatus={
          setFilterStatus
        }
        exportCSV={
          exportCSV
        }
        clearHistory={
          clearHistory
        }
      />

    </>
  );


  // ============================
  // INSPECTION PAGE
  // ============================

  const renderInspection = () => (

    <>

      <div className="page-header">

        <div>

          <h1>
            Inspect Image
          </h1>

          <p>
            Run industrial defect detection
            on a product image
          </p>

        </div>

      </div>


      <div className="inspection-layout">


        {/* INPUT */}

        <div className="panel inspection-upload">

          <h3>
            Input Image
          </h3>


          {!selectedFile ? (

            <label className="large-upload-box">

              <Upload size={48} />

              <h3>
                Select Product Image
              </h3>

              <p>
                Upload a PNG, JPG or JPEG image
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={
                  handleFileChange
                }
              />

            </label>

          ) : (

            <div className="preview-container">

              <img
                src={preview}
                alt="Selected inspection"
                className="inspection-preview"
              />


              <div className="selected-file">

                <CheckCircle2
                  size={24}
                />

                <div>

                  <strong>
                    {selectedFile.name}
                  </strong>

                  <p>
                    {
                      (
                        selectedFile.size /
                        1024 /
                        1024
                      ).toFixed(2)
                    } MB
                  </p>

                </div>

              </div>

            </div>

          )}


          <div className="button-group">

            <button
              className="primary-button"
              onClick={
                runDetection
              }
              disabled={
                !selectedFile ||
                isDetecting
              }
            >

              <Zap size={18} />

              {isDetecting
                ? "Analyzing..."
                : "Run Detection"}

            </button>


            <button
              className="secondary-button"
              onClick={
                resetInspection
              }
              disabled={
                isDetecting
              }
            >

              <RotateCcw
                size={18}
              />

              Reset

            </button>

          </div>

        </div>


        {/* RESULT */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Detection Result
              </h3>

              <p>
                AI model output
              </p>

            </div>

          </div>


          {isDetecting ? (

            <div className="result-placeholder">

              <div className="loader"></div>

              <h3>
                Analyzing Image...
              </h3>

              <p>
                Running industrial
                defect detection
              </p>

            </div>

          ) : !result ? (

            <div className="result-placeholder">

              <ScanSearch
                size={50}
              />

              <h3>
                No inspection yet
              </h3>

              <p>
                Upload an image and run
                detection to view results.
              </p>

            </div>

          ) : (

            <div className="full-result">

              <div
                className={
                  result.status ===
                  "Defect Detected"
                    ? "result-banner defect-banner"
                    : "result-banner success-banner"
                }
              >

                {result.status ===
                "Defect Detected" ? (

                  <AlertTriangle
                    size={32}
                  />

                ) : (

                  <CheckCircle2
                    size={32}
                  />

                )}


                <div>

                  <strong>
                    {result.status}
                  </strong>

                  <p>
                    {result.defect}
                  </p>

                </div>

              </div>


              <div className="result-metrics">

                <div>

                  <span>
                    Confidence
                  </span>

                  <strong>
                    {
                      result.confidence
                    }%
                  </strong>

                </div>


                <div>

                  <span>
                    Latency
                  </span>

                  <strong>
                    {
                      result.latency
                    } ms
                  </strong>

                </div>


                <div>

                  <span>
                    Model
                  </span>

                  <strong>
                    YOLOv8
                  </strong>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </>
  );


  // ============================
  // MODELS
  // ============================

  const renderModels = () => (

    <>

      <div className="page-header">

        <div>

          <h1>
            AI Models
          </h1>

          <p>
            Models used in the hybrid
            defect detection framework
          </p>

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


  // ============================
  // REPORTS
  // ============================

  const renderReports = () => (

    <>

      <div className="page-header">

        <div>

          <h1>
            Reports & Metrics
          </h1>

          <p>
            Inspection and system
            performance analysis
          </p>

        </div>


        <button
          className="primary-button report-button"
          onClick={
            exportCSV
          }
        >

          <Download
            size={17}
          />

          Export CSV

        </button>

      </div>


      <div className="metrics-grid">

        <MetricCard
          icon={
            <ScanSearch
              size={22}
            />
          }
          title="Total Inspections"
          value={
            totalInspections
          }
        />

        <MetricCard
          icon={
            <AlertTriangle
              size={22}
            />
          }
          title="Defects"
          value={
            defectsDetected
          }
        />

        <MetricCard
          icon={
            <CheckCircle2
              size={22}
            />
          }
          title="Passed"
          value={
            defectFree
          }
        />

        <MetricCard
          icon={
            <Clock3
              size={22}
            />
          }
          title="Avg. Latency"
          value={`${averageLatency} ms`}
        />

      </div>


      <div className="panel">

        <div className="report-table">

          <div className="table-row table-header">

            <span>
              Metric
            </span>

            <span>
              Value
            </span>

            <span>
              Status
            </span>

          </div>


          <ReportRow
            name="Defect Rate"
            value={`${defectRate}%`}
          />

          <ReportRow
            name="Pass Rate"
            value={`${passRate}%`}
          />

          <ReportRow
            name="Average Inference Latency"
            value={`${averageLatency} ms`}
          />

          <ReportRow
            name="Total Inspections"
            value={
              totalInspections
            }
          />

        </div>

      </div>

    </>
  );


  // ============================
  // SETTINGS
  // ============================

  const renderSettings = () => (

    <>

      <div className="page-header">

        <div>

          <h1>
            Settings
          </h1>

          <p>
            Inspection system configuration
          </p>

        </div>

      </div>


      <div className="panel settings-panel">

        <h3>
          Detection Configuration
        </h3>


        <div className="setting-row">

          <div>

            <strong>
              Detection Mode
            </strong>

            <p>
              Select inspection processing mode
            </p>

          </div>


          <select
            value={
              detectionMode
            }
            onChange={(event) =>
              setDetectionMode(
                event.target.value
              )
            }
            className="setting-select"
          >

            <option value="Real-Time">
              Real-Time
            </option>

            <option value="Batch">
              Batch
            </option>

          </select>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              Confidence Threshold
            </strong>

            <p>
              Minimum confidence required
              for detection
            </p>

          </div>


          <div className="threshold-control">

            <input
              type="range"
              min="10"
              max="95"
              value={
                confidenceThreshold
              }
              onChange={(event) =>
                setConfidenceThreshold(
                  Number(
                    event.target.value
                  )
                )
              }
            />

            <strong>
              {confidenceThreshold}%
            </strong>

          </div>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              Edge Optimization
            </strong>

            <p>
              Low latency and reduced
              memory usage
            </p>

          </div>

          <span className="setting-value">
            Enabled
          </span>

        </div>


        <div className="setting-row">

          <div>

            <strong>
              YOLOv8 Detector
            </strong>

            <p>
              Primary object detection model
            </p>

          </div>

          <span className="setting-value">
            Ready
          </span>

        </div>

      </div>

    </>
  );


  // ============================
  // PAGE ROUTER
  // ============================

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


  // ============================
  // MAIN UI
  // ============================

  return (

    <div className="app">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-icon">

            <Cpu
              size={25}
            />

          </div>


          <div>

            <h2>
              DefectAI
            </h2>

            <span>
              Industrial Vision
            </span>

          </div>

        </div>


        <nav>

          {menuItems.map(
            (item) => {

              const Icon =
                item.icon;

              return (

                <button
                  key={item.name}
                  className={
                    `nav-item ${
                      activePage ===
                      item.name
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={() =>
                    setActivePage(
                      item.name
                    )
                  }
                >

                  <Icon
                    size={19}
                  />

                  <span>
                    {item.name}
                  </span>

                </button>

              );

            }
          )}

        </nav>


        <div className="sidebar-footer">

          <div className="edge-status">

            <span className="status-dot"></span>

            <div>

              <strong>
                Edge Device
              </strong>

              <small>
                Not Connected
              </small>

            </div>

          </div>

        </div>

      </aside>


      <main className="main-content">

        <header className="topbar">

          <span>
            Real-Time Industrial Inspection
          </span>


       

        </header>


        <section className="content">

          {renderPage()}

        </section>

      </main>

    </div>

  );
}


// =================================
// METRIC CARD
// =================================

function MetricCard({
  icon,
  title,
  value,
}) {

  return (

    <div className="metric-card">

      <div className="metric-icon">

        {icon}

      </div>


      <div>

        <span>
          {title}
        </span>

        <h2>
          {value}
        </h2>

      </div>

    </div>

  );
}


// =================================
// LATEST RESULT
// =================================

function LatestResult({
  result,
}) {

  return (

    <div className="latest-result">

      <div
        className={
          result.status ===
          "Defect Detected"
            ? "result-status defect-status"
            : "result-status success-status"
        }
      >

        {result.status ===
        "Defect Detected" ? (

          <AlertTriangle
            size={30}
          />

        ) : (

          <CheckCircle2
            size={30}
          />

        )}


        <div>

          <strong>
            {result.status}
          </strong>

          <p>
            {result.defect}
          </p>

        </div>

      </div>


      <div className="result-details">

        <div>

          <span>
            Confidence
          </span>

          <strong>
            {result.confidence}%
          </strong>

        </div>


        <div>

          <span>
            Latency
          </span>

          <strong>
            {result.latency} ms
          </strong>

        </div>

      </div>

    </div>

  );

}


// =================================
// HISTORY PANEL
// =================================

function HistoryPanel({
  history,
  filteredHistory,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  exportCSV,
  clearHistory,
}) {

  return (

    <div className="panel">

      <div className="history-header">

        <div>

          <h3>
            Recent Inspections
          </h3>

          <p>
            Inspection history and
            detection results
          </p>

        </div>


        <div className="history-actions">

          <button
            className="secondary-button"
            onClick={
              exportCSV
            }
          >

            <Download
              size={15}
            />

            Export

          </button>


          <button
            className="danger-button"
            onClick={
              clearHistory
            }
          >

            <Trash2
              size={15}
            />

            Clear

          </button>

        </div>

      </div>


      <div className="history-toolbar">

        <div className="search-box">

          <Search
            size={16}
          />

          <input
            type="text"
            placeholder="Search inspections..."
            value={
              searchTerm
            }
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <select
          value={
            filterStatus
          }
          onChange={(event) =>
            setFilterStatus(
              event.target.value
            )
          }
          className="filter-select"
        >

          <option value="All">
            All Results
          </option>

          <option value="Defect">
            Defects
          </option>

          <option value="Passed">
            Passed
          </option>

        </select>

      </div>


      {history.length === 0 ? (

        <div className="empty-history">

          No inspections performed yet.

        </div>

      ) : filteredHistory.length === 0 ? (

        <div className="empty-history">

          No matching inspections found.

        </div>

      ) : (

        <div className="history-list">

          {filteredHistory.map(
            (item) => (

              <div
                className="history-row"
                key={item.id}
              >

                <div className="history-image">

                  {item.image && (

                    <img
                      src={
                        item.image
                      }
                      alt="inspection"
                    />

                  )}

                </div>


                <div className="history-info">

                  <strong>
                    {item.defect}
                  </strong>

                  <span>
                    {item.fileName}
                  </span>

                </div>


                <div>

                  <strong>
                    {item.confidence}%
                  </strong>

                  <span>
                    Confidence
                  </span>

                </div>


                <div>

                  <strong>
                    {item.latency} ms
                  </strong>

                  <span>
                    Latency
                  </span>

                </div>


                <div>

                  <span
                    className={
                      item.status ===
                      "Defect-Free"
                        ? "status-badge passed"
                        : "status-badge defect"
                    }
                  >

                    {item.status}

                  </span>

                </div>


                <div className="history-time">

                  <span>
                    {item.time}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>

  );

}


// =================================
// MODEL CARD
// =================================

function ModelCard({
  title,
  model,
  purpose,
}) {

  return (

    <div className="panel model-card">

      <div className="model-card-icon">

        <Cpu
          size={25}
        />

      </div>


      <h3>
        {title}
      </h3>


      <span className="model-name">

        {model}

      </span>


      <p>

        {purpose}

      </p>


      <div className="model-ready">

        <span className="status-dot"></span>

        Ready

      </div>

    </div>

  );

}


// =================================
// REPORT ROW
// =================================

function ReportRow({
  name,
  value,
}) {

  return (

    <div className="table-row">

      <span>
        {name}
      </span>


      <strong>
        {value}
      </strong>


      <span className="ready-badge">

        <span className="status-dot"></span>

        Available

      </span>

    </div>

  );

}


export default App;