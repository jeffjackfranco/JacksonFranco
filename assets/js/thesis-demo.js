// Thesis Discussion Platform Demo JavaScript

let currentUser = null;

function initializeThesisDemo() {
    const demoContent = document.getElementById('demo-content');
    
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('thesisUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showThesisMain();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    const demoContent = document.getElementById('demo-content');
    
    demoContent.innerHTML = `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card demo-card">
                        <div class="card-header text-center">
                            <h5 class="mb-0">
                                <i class="fas fa-comments me-2"></i>
                                Thesis Discussion Platform
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="text-muted text-center mb-4">
                                Welcome to the collaborative thesis development platform. Login or register to participate in discussions.
                            </p>
                            
                            <ul class="nav nav-tabs mb-3" id="authTabs" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button">
                                        Login
                                    </button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button">
                                        Register
                                    </button>
                                </li>
                            </ul>
                            
                            <div class="tab-content" id="authTabContent">
                                <div class="tab-pane fade show active" id="login" role="tabpanel">
                                    <form id="login-form">
                                        <div class="mb-3">
                                            <label for="login-username" class="form-label">Username</label>
                                            <input type="text" class="form-control" id="login-username" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="login-password" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="login-password" required>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100">Login</button>
                                    </form>
                                    
                                    <div class="mt-3 p-3 bg-light rounded">
                                        <h6>Demo Accounts:</h6>
                                        <p class="small mb-1"><strong>Username:</strong> jackson | <strong>Password:</strong> portfolio</p>
                                        <p class="small mb-0"><strong>Username:</strong> user123 | <strong>Password:</strong> securepass123</p>
                                    </div>
                                </div>
                                
                                <div class="tab-pane fade" id="register" role="tabpanel">
                                    <form id="register-form">
                                        <div class="mb-3">
                                            <label for="register-username" class="form-label">Username</label>
                                            <input type="text" class="form-control" id="register-username" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="register-password" class="form-label">Password</label>
                                            <input type="password" class="form-control" id="register-password" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="register-confirm" class="form-label">Confirm Password</label>
                                            <input type="password" class="form-control" id="register-confirm" required>
                                        </div>
                                        <button type="submit" class="btn btn-success w-100">Register</button>
                                    </form>
                                </div>
                            </div>
                            
                            <div id="auth-message" class="mt-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setupAuthEventListeners();
}

function setupAuthEventListeners() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('auth-message');
    
    // Get users from localStorage or use defaults
    const users = getUsers();
    
    if (users[username] && users[username].password === password) {
        currentUser = users[username];
        localStorage.setItem('thesisUser', JSON.stringify(currentUser));
        showThesisMain();
    } else {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Invalid username or password.
            </div>
        `;
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const messageDiv = document.getElementById('auth-message');
    
    if (password !== confirm) {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Passwords do not match.
            </div>
        `;
        return;
    }
    
    const users = getUsers();
    
    if (users[username]) {
        messageDiv.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Username already exists.
            </div>
        `;
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        statementPositions: {
            "1": null, "2": null, "3": null, "4": null, "5": null, "6": null
        }
    };
    
    users[username] = newUser;
    localStorage.setItem('thesisUsers', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('thesisUser', JSON.stringify(currentUser));
    
    showThesisMain();
}

function getUsers() {
    const stored = localStorage.getItem('thesisUsers');
    if (stored) {
        return JSON.parse(stored);
    }
    
    // Initialize with default users
    const { defaultUsers } = window.portfolioData;
    localStorage.setItem('thesisUsers', JSON.stringify(defaultUsers));
    return defaultUsers;
}

function showThesisMain() {
    const demoContent = document.getElementById('demo-content');
    
    demoContent.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card demo-card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">
                                    <i class="fas fa-comments me-2"></i>
                                    Thesis Discussion Platform
                                </h5>
                                <div>
                                    <span class="me-3">Welcome, <strong>${currentUser.username}</strong></span>
                                    <button class="btn btn-outline-secondary btn-sm" onclick="logout()">
                                        <i class="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p class="text-muted mb-4">
                                Explore controversial topics, share your arguments, and engage in AI-powered debates. 
                                Choose a statement below to begin your discussion.
                            </p>
                            
                            <div id="statements-list">
                                <!-- Statements will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadStatements();
}

function loadStatements() {
    const { thesisStatements } = window.portfolioData;
    const statementsContainer = document.getElementById('statements-list');
    
    const statementsHtml = thesisStatements.map(statement => {
        const userPosition = currentUser.statementPositions[statement.id.toString()];
        const positionBadge = userPosition ? 
            `<span class="badge bg-${userPosition === 'agree' ? 'success' : 'danger'}">${userPosition}</span>` :
            '<span class="badge bg-secondary">No Position</span>';
        
        return `
            <div class="statement-card" onclick="openStatement(${statement.id})">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-2">"${statement.statement}"</h6>
                        <p class="text-muted small mb-0">Click to explore arguments and join the discussion</p>
                    </div>
                    <div class="text-end">
                        ${positionBadge}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    statementsContainer.innerHTML = statementsHtml;
}

function openStatement(statementId) {
    const { thesisStatements } = window.portfolioData;
    const statement = thesisStatements.find(s => s.id === statementId);
    
    if (!statement) return;
    
    const userPosition = currentUser.statementPositions[statementId.toString()];
    
    // Create a custom modal overlay within the demo container
    const demoContent = document.getElementById('demo-content');
    
    // Remove any existing statement view
    const existing = document.getElementById('statement-detail-view');
    if (existing) {
        existing.remove();
    }
    
    const statementHtml = `
        <div id="statement-detail-view" class="statement-detail-overlay">
            <div class="statement-detail-container">
                <div class="statement-detail-header">
                    <h5>Statement ${statementId}</h5>
                    <button type="button" class="btn btn-outline-light" onclick="closeStatementView()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
                <div class="statement-detail-body">
                    <blockquote class="blockquote text-center mb-4">
                        <p class="mb-0">"${statement.statement}"</p>
                    </blockquote>
                    
                    <div class="position-selection mb-4">
                        <h6>Your Position:</h6>
                        <div class="btn-group w-100" role="group">
                            <button type="button" class="btn position-btn ${userPosition === 'agree' ? 'btn-success active' : 'btn-outline-success'}" 
                                    onclick="setPosition(${statementId}, 'agree')">
                                <i class="fas fa-thumbs-up me-2"></i>Agree
                            </button>
                            <button type="button" class="btn position-btn ${userPosition === 'disagree' ? 'btn-danger active' : 'btn-outline-danger'}" 
                                    onclick="setPosition(${statementId}, 'disagree')">
                                <i class="fas fa-thumbs-down me-2"></i>Disagree
                            </button>
                        </div>
                    </div>
                    
                    <div id="statement-content-${statementId}">
                        <!-- Arguments will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `;
    
    demoContent.insertAdjacentHTML('beforeend', statementHtml);
    
    // Add click handler to close when clicking outside the container
    const overlay = document.getElementById('statement-detail-view');
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeStatementView();
        }
    });
    
    if (userPosition) {
        loadArguments(statementId, userPosition);
    }
}

function closeStatementView() {
    const statementView = document.getElementById('statement-detail-view');
    if (statementView) {
        statementView.remove();
    }
}

function setPosition(statementId, position) {
    // Update user position
    currentUser.statementPositions[statementId.toString()] = position;
    
    // Save to localStorage
    localStorage.setItem('thesisUser', JSON.stringify(currentUser));
    
    // Update users in storage
    const users = getUsers();
    users[currentUser.username] = currentUser;
    localStorage.setItem('thesisUsers', JSON.stringify(users));
    
    // Update button states within the statement detail view
    const statementView = document.getElementById('statement-detail-view');
    if (statementView) {
        const buttons = statementView.querySelectorAll('.position-btn');
        buttons.forEach(btn => {
            btn.classList.remove('btn-success', 'btn-danger', 'active');
            btn.classList.add(btn.textContent.includes('Agree') ? 'btn-outline-success' : 'btn-outline-danger');
        });
        
        const activeBtn = statementView.querySelector(`.position-btn:nth-child(${position === 'agree' ? '1' : '2'})`);
        activeBtn.classList.remove('btn-outline-success', 'btn-outline-danger');
        activeBtn.classList.add(position === 'agree' ? 'btn-success' : 'btn-danger', 'active');
    }
    
    // Load arguments for the selected position
    loadArguments(statementId, position);
    
    // Refresh statements list
    loadStatements();
}

function loadArguments(statementId, position) {
    const contentDiv = document.getElementById(`statement-content-${statementId}`);
    
    let arguments = [];
    if (statementId === 1) {
        arguments = position === 'agree' ? 
            window.portfolioData.arguments1Agree : 
            window.portfolioData.arguments1Disagree;
    } else if (statementId === 2) {
        arguments = position === 'agree' ? 
            window.portfolioData.arguments2Agree : 
            window.portfolioData.arguments2Disagree;
    }
    
    const argumentsHtml = arguments.length > 0 ? `
        <div class="arguments-section mb-4">
            <h6>
                <i class="fas fa-${position === 'agree' ? 'thumbs-up text-success' : 'thumbs-down text-danger'} me-2"></i>
                Arguments ${position === 'agree' ? 'Supporting' : 'Opposing'} This Statement
            </h6>
            <div class="arguments-list">
                ${arguments.map(arg => `
                    <div class="argument-item">
                        <p class="mb-2">${arg.text}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">by ${arg.user}</small>
                            <span class="vote-count">${arg.votes} votes</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';
    
    const addArgumentHtml = `
        <div class="add-argument-section">
            <h6>Add Your Argument:</h6>
            <div class="mb-3">
                <textarea class="form-control" id="new-argument-${statementId}" rows="3" 
                          placeholder="Share your reasoning for ${position === 'agree' ? 'agreeing' : 'disagreeing'} with this statement..."></textarea>
            </div>
            <div class="d-flex gap-2">
                <button class="btn btn-primary" onclick="checkSimilarity(${statementId})">
                    <i class="fas fa-search me-2"></i>Check Similarity
                </button>
                <button class="btn btn-success" onclick="submitArgument(${statementId}, '${position}')">
                    <i class="fas fa-plus me-2"></i>Add Argument
                </button>
                <button class="btn btn-info" onclick="generateDebate(${statementId}, '${position}')">
                    <i class="fas fa-comments me-2"></i>AI Debate
                </button>
            </div>
            <div id="similarity-results-${statementId}" class="mt-3"></div>
            <div id="debate-results-${statementId}" class="mt-3"></div>
        </div>
    `;
    
    contentDiv.innerHTML = argumentsHtml + addArgumentHtml;
}

function checkSimilarity(statementId) {
    const textarea = document.getElementById(`new-argument-${statementId}`);
    const resultsDiv = document.getElementById(`similarity-results-${statementId}`);
    const argument = textarea.value.trim();
    
    if (!argument) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                Please enter an argument to check for similarity.
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = showLoading('Checking for similar arguments...');
    
    setTimeout(() => {
        const similar = findSimilarArguments(argument);
        displaySimilarityResults(similar, statementId);
    }, 1500);
}

function findSimilarArguments(argument) {
    const { similarArguments } = window.portfolioData;
    const lowerArg = argument.toLowerCase();
    
    // Simple keyword matching for demo purposes
    for (const [key, results] of Object.entries(similarArguments)) {
        if (lowerArg.includes('social media') && lowerArg.includes('isolated') ||
            lowerArg.includes('ai') && lowerArg.includes('obsolete')) {
            return results;
        }
    }
    
    return [];
}

function displaySimilarityResults(similar, statementId) {
    const resultsDiv = document.getElementById(`similarity-results-${statementId}`);
    
    if (similar.length === 0) {
        resultsDiv.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check me-2"></i>
                No similar arguments found. Your argument appears to be unique!
            </div>
        `;
    } else {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                <h6><i class="fas fa-exclamation-triangle me-2"></i>Similar Arguments Found:</h6>
                ${similar.map(arg => `
                    <div class="mb-2">
                        <strong>${Math.round(arg.similarity * 100)}% similar:</strong> ${arg.text}
                    </div>
                `).join('')}
                <p class="mb-0 mt-2 small">Consider refining your argument to add unique value to the discussion.</p>
            </div>
        `;
    }
}

function submitArgument(statementId, position) {
    const textarea = document.getElementById(`new-argument-${statementId}`);
    const argument = textarea.value.trim();
    
    if (!argument) {
        alert('Please enter an argument before submitting.');
        return;
    }
    
    // Simulate successful submission
    const successHtml = `
        <div class="alert alert-success">
            <i class="fas fa-check me-2"></i>
            Your argument has been submitted successfully! It will be reviewed and added to the discussion.
        </div>
    `;
    
    textarea.value = '';
    document.getElementById(`similarity-results-${statementId}`).innerHTML = successHtml;
}

function generateDebate(statementId, position) {
    const textarea = document.getElementById(`new-argument-${statementId}`);
    const resultsDiv = document.getElementById(`debate-results-${statementId}`);
    const argument = textarea.value.trim();
    
    if (!argument) {
        resultsDiv.innerHTML = `
            <div class="alert alert-warning">
                Please enter your argument to generate an AI debate response.
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = showLoading('Generating AI debate response...');
    
    setTimeout(() => {
        const response = getDebateResponse(statementId, position);
        displayDebateResponse(response, statementId);
    }, 2000);
}

function getDebateResponse(statementId, position) {
    const { debateResponses } = window.portfolioData;
    const opposingPosition = position === 'agree' ? 'disagree' : 'agree';
    
    if (debateResponses[statementId] && debateResponses[statementId][opposingPosition]) {
        return debateResponses[statementId][opposingPosition];
    }
    
    return "This would be a thoughtful response that presents counterarguments to your position, drawing from the collective knowledge in our argument database.";
}

function displayDebateResponse(response, statementId) {
    const resultsDiv = document.getElementById(`debate-results-${statementId}`);
    
    resultsDiv.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">
                    <i class="fas fa-robot me-2"></i>
                    AI Debate Response
                </h6>
            </div>
            <div class="card-body">
                <p class="mb-0">${response}</p>
            </div>
        </div>
    `;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('thesisUser');
    showLoginScreen();
} 