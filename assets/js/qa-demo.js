// QA Analytics Demo JavaScript

function initializeQADemo() {
    const demoContent = document.getElementById('demo-content');
    
    demoContent.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card demo-card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-chart-line me-2"></i>
                                Quality Assurance Analytics Dashboard
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted mb-4">
                                This demo simulates an automated QA system that monitors business metrics and detects anomalies. 
                                Select a region to analyze its performance metrics and identify potential issues.
                            </p>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <label for="region-select" class="form-label">Select Region</label>
                                    <select class="form-select" id="region-select">
                                        <option value="">Choose a region...</option>
                                        <option value="North">North Region</option>
                                        <option value="South">South Region</option>
                                        <option value="East">East Region</option>
                                        <option value="West">West Region</option>
                                    </select>
                                </div>
                                <div class="col-md-6 d-flex align-items-end">
                                    <button class="btn btn-warning" id="analyze-btn" disabled>
                                        <i class="fas fa-search"></i> Run Analysis
                                    </button>
                                </div>
                            </div>
                            
                            <div id="analysis-results"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupQAEventListeners();
}

function setupQAEventListeners() {
    const regionSelect = document.getElementById('region-select');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    regionSelect.addEventListener('change', function() {
        analyzeBtn.disabled = !this.value;
    });
    
    analyzeBtn.addEventListener('click', performQAAnalysis);
}

function performQAAnalysis() {
    const region = document.getElementById('region-select').value;
    const resultsContainer = document.getElementById('analysis-results');
    
    if (!region) return;
    
    // Show loading state
    resultsContainer.innerHTML = showLoading('Analyzing metrics and detecting anomalies...');
    
    // Simulate analysis delay
    setTimeout(() => {
        const analysis = runQAAnalysis(region);
        displayQAResults(analysis);
    }, 2000);
}

function runQAAnalysis(regionName) {
    const { qaRegions } = window.portfolioData;
    const regionData = qaRegions[regionName];
    
    if (!regionData) return null;
    
    const analysis = {
        region: regionName,
        manager: regionData.manager,
        email: regionData.email,
        metrics: []
    };
    
    // Analyze each metric
    regionData.metrics.forEach(metric => {
        const metricData = metric.data;
        
        // Calculate 30-day average (excluding the last day)
        const avg30Days = metricData.slice(0, -1).reduce((sum, val) => sum + val, 0) / 29;
        
        // Check last 7 days for anomalies
        const last7Days = metricData.slice(-7);
        const anomalies = [];
        
        last7Days.forEach((dayValue, index) => {
            const dayIndex = 30 - 7 + index;
            const percentDiff = ((dayValue - avg30Days) / avg30Days) * 100;
            
            // If value is 15% below average, flag it
            if (percentDiff < -15) {
                anomalies.push({
                    day: dayIndex + 1,
                    value: dayValue,
                    avg: avg30Days,
                    percentDiff: percentDiff
                });
            }
        });
        
        analysis.metrics.push({
            name: metric.name,
            average: avg30Days,
            lastValue: metricData[metricData.length - 1],
            allValues: metricData,
            anomalies: anomalies
        });
    });
    
    return analysis;
}

function displayQAResults(analysis) {
    const resultsContainer = document.getElementById('analysis-results');
    
    if (!analysis) {
        resultsContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error: Could not analyze the selected region.
            </div>
        `;
        return;
    }
    
    const hasAnomalies = analysis.metrics.some(metric => metric.anomalies.length > 0);
    
    const resultsHtml = `
        <div class="analysis-header mb-4">
            <div class="row">
                <div class="col-md-8">
                    <h6>
                        <i class="fas fa-map-marker-alt me-2"></i>
                        Analysis Results: ${analysis.region} Region
                    </h6>
                    <p class="text-muted mb-0">
                        Manager: ${analysis.manager} | Contact: ${analysis.email}
                    </p>
                </div>
                <div class="col-md-4 text-end">
                    ${hasAnomalies ? 
                        '<span class="badge bg-danger fs-6"><i class="fas fa-exclamation-triangle me-1"></i>Anomalies Detected</span>' :
                        '<span class="badge bg-success fs-6"><i class="fas fa-check me-1"></i>All Metrics Normal</span>'
                    }
                </div>
            </div>
        </div>
        
        <div class="metrics-overview mb-4">
            <div class="row">
                ${analysis.metrics.map((metric, index) => `
                    <div class="col-md-4 mb-3">
                        <div class="metric-card">
                            <h6 class="mb-2">${metric.name}</h6>
                            <div class="metric-stats">
                                <div class="row">
                                    <div class="col-6">
                                        <small class="text-muted">30-Day Avg</small>
                                        <div class="fw-bold">${metric.average.toFixed(1)}</div>
                                    </div>
                                    <div class="col-6">
                                        <small class="text-muted">Latest</small>
                                        <div class="fw-bold ${metric.lastValue < metric.average * 0.85 ? 'text-danger' : 'text-success'}">
                                            ${metric.lastValue.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${metric.anomalies.length > 0 ? `
                                <div class="mt-2">
                                    <span class="badge bg-warning text-dark">
                                        ${metric.anomalies.length} anomal${metric.anomalies.length === 1 ? 'y' : 'ies'}
                                    </span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${hasAnomalies ? `
            <div class="anomalies-section mb-4">
                <h6><i class="fas fa-exclamation-triangle me-2 text-warning"></i>Detected Anomalies</h6>
                ${analysis.metrics.filter(m => m.anomalies.length > 0).map(metric => `
                    <div class="anomaly-alert">
                        <h6 class="mb-2">${metric.name}</h6>
                        ${metric.anomalies.map(anomaly => `
                            <div class="mb-2">
                                <strong>Day ${anomaly.day}:</strong> 
                                Value ${anomaly.value.toFixed(1)} is ${Math.abs(anomaly.percentDiff).toFixed(1)}% below 
                                the 30-day average of ${anomaly.avg.toFixed(1)}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        <div class="charts-section">
            <h6><i class="fas fa-chart-line me-2"></i>Metric Trends (30 Days)</h6>
            <div class="row">
                ${analysis.metrics.map((metric, index) => `
                    <div class="col-12 mb-4">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">${metric.name}</h6>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="chart-${index}"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="recommendations mt-4">
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0">
                        <i class="fas fa-lightbulb me-2"></i>
                        Recommendations
                    </h6>
                </div>
                <div class="card-body">
                    ${hasAnomalies ? `
                        <ul class="mb-0">
                            <li>Contact ${analysis.manager} immediately to discuss the detected anomalies</li>
                            <li>Investigate potential causes for the performance drops</li>
                            <li>Implement corrective measures and monitor closely</li>
                            <li>Set up alerts for future anomaly detection</li>
                        </ul>
                    ` : `
                        <p class="mb-0 text-success">
                            <i class="fas fa-check-circle me-2"></i>
                            All metrics are within normal ranges. Continue monitoring and maintain current performance levels.
                        </p>
                    `}
                </div>
            </div>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHtml;
    
    // Create charts after DOM is updated
    setTimeout(() => {
        createQACharts(analysis);
    }, 100);
}

function createQACharts(analysis) {
    analysis.metrics.forEach((metric, index) => {
        const canvas = document.getElementById(`chart-${index}`);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Create gradient for background
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
        gradient.addColorStop(1, 'rgba(54, 162, 235, 0.02)');
        
        // Calculate average line
        const avg = metric.allValues.slice(0, -1).reduce((sum, val) => sum + val, 0) / 29;
        const avgLine = new Array(30).fill(avg);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                datasets: [
                    {
                        label: metric.name,
                        data: metric.allValues,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: gradient,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: metric.allValues.map((val, i) => 
                            i >= 23 && val < avg * 0.85 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'
                        ),
                        pointBorderColor: metric.allValues.map((val, i) => 
                            i >= 23 && val < avg * 0.85 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'
                        ),
                        pointRadius: metric.allValues.map((val, i) => 
                            i >= 23 && val < avg * 0.85 ? 6 : 3
                        )
                    },
                    {
                        label: '30-Day Average',
                        data: avgLine,
                        borderColor: 'rgba(255, 159, 64, 0.8)',
                        backgroundColor: 'transparent',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Day'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    });
} 