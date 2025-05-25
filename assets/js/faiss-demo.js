// FAISS Document Similarity Demo JavaScript

function initializeFaissDemo() {
    const demoContent = document.getElementById('demo-content');
    
    demoContent.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card demo-card">
                        <div class="card-header">
                            <h5 class="mb-0">
                                <i class="fas fa-search me-2"></i>
                                Document Similarity Search
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted mb-4">
                                This demo simulates a FAISS-powered document similarity search system. 
                                Enter a question to find the most semantically similar documents in our knowledge base.
                            </p>
                            
                            <div class="mb-4">
                                <label for="query-input" class="form-label">Search Query</label>
                                <div class="input-group">
                                    <input type="text" class="form-control search-box" id="query-input" 
                                           placeholder="Enter your question here..." 
                                           style="border-radius: 25px 0 0 25px;">
                                    <button class="btn btn-primary" type="button" id="search-btn" 
                                            style="border-radius: 0 25px 25px 0;">
                                        <i class="fas fa-search"></i> Search
                                    </button>
                                </div>
                                <div class="form-text">
                                    Try example queries: "How do I update my benefits?", "What's the process for requesting time off?", or "How do I reset my password?"
                                </div>
                            </div>
                            
                            <div id="search-results" class="mt-4"></div>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">
                                    <i class="fas fa-info-circle me-2"></i>
                                    How It Works
                                </h6>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <div class="text-center">
                                            <i class="fas fa-file-text fa-3x text-primary mb-2"></i>
                                            <h6>Document Processing</h6>
                                            <p class="small text-muted">Documents are processed and converted into high-dimensional vectors using advanced NLP models.</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="text-center">
                                            <i class="fas fa-database fa-3x text-info mb-2"></i>
                                            <h6>Vector Storage</h6>
                                            <p class="small text-muted">FAISS efficiently stores and indexes millions of vectors for lightning-fast similarity search.</p>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <div class="text-center">
                                            <i class="fas fa-search fa-3x text-success mb-2"></i>
                                            <h6>Similarity Search</h6>
                                            <p class="small text-muted">User queries are vectorized and matched against the database to find the most relevant documents.</p>
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
    
    // Add event listeners
    setupFaissEventListeners();
}

function setupFaissEventListeners() {
    const searchBtn = document.getElementById('search-btn');
    const queryInput = document.getElementById('query-input');
    
    searchBtn.addEventListener('click', performFaissSearch);
    
    queryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performFaissSearch();
        }
    });
    
    // Add some example queries as clickable suggestions
    addExampleQueries();
}

function addExampleQueries() {
    const exampleQueries = [
        "How do I update my benefits?",
        "What's the process for requesting time off?",
        "How do I reset my password?"
    ];
    
    const searchBox = document.getElementById('query-input');
    const container = searchBox.closest('.mb-4');
    
    const examplesDiv = document.createElement('div');
    examplesDiv.className = 'mt-2';
    examplesDiv.innerHTML = `
        <small class="text-muted">Quick examples: </small>
        ${exampleQueries.map(query => 
            `<button class="btn btn-sm btn-outline-secondary me-2 mb-1 example-query" data-query="${query}">${query}</button>`
        ).join('')}
    `;
    
    container.appendChild(examplesDiv);
    
    // Add click handlers for example queries
    examplesDiv.querySelectorAll('.example-query').forEach(btn => {
        btn.addEventListener('click', function() {
            searchBox.value = this.getAttribute('data-query');
            performFaissSearch();
        });
    });
}

function performFaissSearch() {
    const query = document.getElementById('query-input').value.trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (!query) {
        resultsContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Please enter a search query.
            </div>
        `;
        return;
    }
    
    // Show loading state
    resultsContainer.innerHTML = showLoading('Searching documents...');
    
    // Simulate search delay
    setTimeout(() => {
        const results = getFaissResults(query);
        displayFaissResults(results, query);
    }, 1500);
}

function getFaissResults(query) {
    // Get results from the data file
    const { faissResults } = window.portfolioData;
    
    // Return exact match or empty array
    return faissResults[query] || [];
}

function displayFaissResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="alert alert-info">
                <h6><i class="fas fa-info-circle me-2"></i>No Results Found</h6>
                <p class="mb-0">No documents found for query: "<strong>${query}</strong>"</p>
                <p class="mb-0 mt-2 small">Try one of the example queries or a similar question.</p>
            </div>
        `;
        return;
    }
    
    const resultsHtml = `
        <div class="search-results-header mb-3">
            <h6>
                <i class="fas fa-list me-2"></i>
                Search Results for: "<span class="text-primary">${query}</span>"
            </h6>
            <p class="text-muted small mb-0">Found ${results.length} relevant document(s)</p>
        </div>
        
        <div class="results-list">
            ${results.map((result, index) => `
                <div class="result-item mb-3 p-3" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="mb-0">${result.title}</h6>
                        <span class="badge bg-primary similarity-badge">
                            ${Math.round(result.similarity * 100)}% match
                        </span>
                    </div>
                    <p class="mb-2 text-muted">${result.content}</p>
                    <div class="similarity-bar mt-2">
                        <div class="progress" style="height: 4px;">
                            <div class="progress-bar" role="progressbar" 
                                 style="width: ${result.similarity * 100}%; transition: width 1s ease-out ${index * 0.2}s;">
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="mt-4 p-3 bg-light rounded">
            <h6><i class="fas fa-lightbulb me-2"></i>Understanding the Results</h6>
            <p class="small text-muted mb-0">
                Results are ranked by semantic similarity using vector embeddings. 
                Higher percentages indicate stronger semantic relationships between your query and the document content.
            </p>
        </div>
    `;
    
    resultsContainer.innerHTML = resultsHtml;
} 