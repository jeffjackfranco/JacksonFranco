// Stock Trading Bot Demo JavaScript

function initializeStockDemo() {
    const demoContent = document.getElementById('demo-content');
    
    demoContent.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card demo-card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-robot me-2"></i>
                                Algorithmic Trading Bot Dashboard
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted mb-4">
                                This demo showcases an algorithmic trading system that analyzes market data and executes trades 
                                using machine learning models. View performance metrics and confidence levels for various stocks.
                            </p>
                            
                            <div class="row mb-4">
                                <div class="col-lg-8">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">
                                                <i class="fas fa-chart-line me-2"></i>
                                                Algorithm Performance Comparison
                                            </h6>
                                        </div>
                                        <div class="card-body">
                                            <div class="chart-container" style="height: 400px;">
                                                <canvas id="performance-chart"></canvas>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="card h-100">
                                        <div class="card-header">
                                            <h6 class="mb-0">
                                                <i class="fas fa-trophy me-2"></i>
                                                Performance Summary
                                            </h6>
                                        </div>
                                        <div class="card-body">
                                            <div id="performance-summary">
                                                <!-- Performance summary will be populated here -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="mb-0">
                                                <i class="fas fa-brain me-2"></i>
                                                AI Prediction Confidence
                                            </h6>
                                        </div>
                                        <div class="card-body">
                                            <p class="text-muted mb-3">
                                                Real-time confidence levels for stock predictions based on machine learning analysis.
                                            </p>
                                            <div id="confidence-grid" class="row">
                                                <!-- Confidence cards will be populated here -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupStockDemo();
}

function setupStockDemo() {
    // Load performance chart
    createPerformanceChart();
    
    // Load performance summary
    updatePerformanceSummary();
    
    // Load confidence grid
    updateConfidenceGrid();
}

function createPerformanceChart() {
    const canvas = document.getElementById('performance-chart');
    const ctx = canvas.getContext('2d');
    
    const { stockBotPerformance } = window.portfolioData;
    
    // Create gradients for each algorithm
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(75, 192, 192, 0.2)');
    gradient1.addColorStop(1, 'rgba(75, 192, 192, 0.02)');
    
    const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgba(54, 162, 235, 0.2)');
    gradient2.addColorStop(1, 'rgba(54, 162, 235, 0.02)');
    
    const gradient3 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient3.addColorStop(0, 'rgba(255, 159, 64, 0.2)');
    gradient3.addColorStop(1, 'rgba(255, 159, 64, 0.02)');
    
    const gradientSP = ctx.createLinearGradient(0, 0, 0, 400);
    gradientSP.addColorStop(0, 'rgba(255, 99, 132, 0.2)');
    gradientSP.addColorStop(1, 'rgba(255, 99, 132, 0.02)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: stockBotPerformance.dates.map(date => new Date(date).toLocaleDateString()),
            datasets: [
                {
                    label: 'Algorithm 1 (Advanced ML)',
                    data: stockBotPerformance.algorithm_1,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: gradient1,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Algorithm 2 (Neural Network)',
                    data: stockBotPerformance.algorithm_2,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: gradient2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Algorithm 3 (Traditional)',
                    data: stockBotPerformance.algorithm_3,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: gradient3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'S&P 500 Benchmark',
                    data: stockBotPerformance.sp500,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: gradientSP,
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5]
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
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Portfolio Value ($)'
                    },
                    beginAtZero: false
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function updatePerformanceSummary() {
    const { stockBotPerformance } = window.portfolioData;
    const summaryContainer = document.getElementById('performance-summary');
    
    // Calculate returns for each algorithm
    const algorithms = [
        { name: 'Algorithm 1', data: stockBotPerformance.algorithm_1, color: 'success' },
        { name: 'Algorithm 2', data: stockBotPerformance.algorithm_2, color: 'primary' },
        { name: 'Algorithm 3', data: stockBotPerformance.algorithm_3, color: 'warning' },
        { name: 'S&P 500', data: stockBotPerformance.sp500, color: 'danger' }
    ];
    
    const summaryHtml = algorithms.map(algo => {
        const initialValue = algo.data[0];
        const finalValue = algo.data[algo.data.length - 1];
        const totalReturn = ((finalValue - initialValue) / initialValue * 100);
        
        return `
            <div class="performance-item mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">${algo.name}</span>
                    <span class="badge bg-${algo.color}">
                        ${totalReturn > 0 ? '+' : ''}${totalReturn.toFixed(1)}%
                    </span>
                </div>
                <div class="progress mt-1" style="height: 6px;">
                    <div class="progress-bar bg-${algo.color}" 
                         style="width: ${Math.min(Math.max((totalReturn + 100) / 4, 0), 100)}%;">
                    </div>
                </div>
                <small class="text-muted">
                    $${initialValue} → $${finalValue.toFixed(2)}
                </small>
            </div>
        `;
    }).join('');
    
    summaryContainer.innerHTML = summaryHtml;
}

function updateConfidenceGrid() {
    const { stockConfidenceData } = window.portfolioData;
    const gridContainer = document.getElementById('confidence-grid');
    
    const confidenceHtml = stockConfidenceData.map((stock, index) => {
        const confidenceColor = getConfidenceColor(stock.confidence);
        const predictionIcon = stock.prediction === 'up' ? 'fa-arrow-up text-success' : 'fa-arrow-down text-danger';
        
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                <div class="card stock-confidence-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="mb-0 fw-bold">${stock.ticker}</h6>
                            <i class="fas ${predictionIcon}"></i>
                        </div>
                        
                        <div class="confidence-display mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="small text-muted">Confidence</span>
                                <span class="fw-bold ${confidenceColor}">${stock.confidence}%</span>
                            </div>
                            <div class="confidence-meter">
                                <div class="confidence-fill bg-${confidenceColor.replace('text-', '')}" 
                                     style="width: ${stock.confidence}%; animation: fillBar 1s ease-out ${index * 0.1}s both;">
                                </div>
                            </div>
                        </div>
                        
                        <div class="prediction-details">
                            <div class="mb-2">
                                <span class="small text-muted">Prediction:</span>
                                <span class="fw-bold prediction-${stock.prediction}">
                                    ${stock.prediction.toUpperCase()}
                                </span>
                            </div>
                            
                            <div class="factors">
                                <span class="small text-muted d-block mb-1">Key Factors:</span>
                                ${stock.factors.slice(0, 2).map(factor => 
                                    `<div class="small text-muted">• ${factor}</div>`
                                ).join('')}
                                ${stock.factors.length > 2 ? 
                                    `<button class="btn btn-sm btn-outline-secondary mt-1" 
                                             onclick="showAllFactors('${stock.ticker}', ${index})">
                                        +${stock.factors.length - 2} more
                                    </button>` : ''
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    gridContainer.innerHTML = confidenceHtml;
}

function getConfidenceColor(confidence) {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 75) return 'text-primary';
    if (confidence >= 60) return 'text-warning';
    return 'text-danger';
}

function showAllFactors(ticker, index) {
    const { stockConfidenceData } = window.portfolioData;
    const stock = stockConfidenceData.find(s => s.ticker === ticker);
    
    if (!stock) return;
    
    const modalHtml = `
        <div class="modal fade" id="factorsModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-chart-line me-2"></i>
                            ${stock.ticker} - Analysis Factors
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <div class="row">
                                <div class="col-6">
                                    <strong>Confidence:</strong> ${stock.confidence}%
                                </div>
                                <div class="col-6">
                                    <strong>Prediction:</strong> 
                                    <span class="prediction-${stock.prediction}">
                                        ${stock.prediction.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <h6>Analysis Factors:</h6>
                        <ul class="list-group list-group-flush">
                            ${stock.factors.map(factor => 
                                `<li class="list-group-item px-0">${factor}</li>`
                            ).join('')}
                        </ul>
                        
                        <div class="mt-3 p-3 bg-light rounded">
                            <small class="text-muted">
                                <i class="fas fa-info-circle me-1"></i>
                                These factors are analyzed in real-time using machine learning models trained on 
                                historical market data, news sentiment, and technical indicators.
                            </small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('factorsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('factorsModal'));
    modal.show();
    
    // Clean up modal after hiding
    document.getElementById('factorsModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Add CSS animation for fill bar
const fillBarStyle = document.createElement('style');
fillBarStyle.textContent = `
    @keyframes fillBar {
        from { width: 0%; }
        to { width: var(--target-width); }
    }
    
    .stock-confidence-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .stock-confidence-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
`;
document.head.appendChild(fillBarStyle); 