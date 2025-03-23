from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import hashlib
import time

app = Flask(__name__)
app.secret_key = "jackson_thesis_app_secret_key"

# Dummy data for the FAISS document similarity project
faiss_results = {
    "How do I update my benefits?": [
        {"title": "Benefits Portal Guide", "content": "The Benefits Portal allows employees to update their benefits selections...", "similarity": 0.92},
        {"title": "Annual Enrollment FAQ", "content": "During annual enrollment, you can make changes to your benefits...", "similarity": 0.85},
        {"title": "HR Contact Information", "content": "For questions about benefits, contact the HR team at...", "similarity": 0.75}
    ],
    "What's the process for requesting time off?": [
        {"title": "PTO Policy", "content": "Employees can request time off through the HR portal...", "similarity": 0.94},
        {"title": "Leave Management System Guide", "content": "The leave management system allows employees to...", "similarity": 0.89},
        {"title": "Manager Approval Process", "content": "All time off requests require manager approval...", "similarity": 0.81}
    ],
    "How do I reset my password?": [
        {"title": "IT Self-Service Portal", "content": "You can reset your password through the IT self-service portal...", "similarity": 0.95},
        {"title": "Password Policy", "content": "Passwords must be at least 12 characters and include...", "similarity": 0.82},
        {"title": "Account Security Guidelines", "content": "To protect your account, never share your password...", "similarity": 0.79}
    ]
}

# Dummy data for the QA Checks demo
qa_regions = {
    "North": {
        "manager": "Sarah Johnson",
        "email": "sarah.johnson@example.com",
        "metrics": [
            {"name": "Sales per Day", "data": [1250, 1320, 1280, 1350, 1410, 1390, 1440, 1380, 1420, 1460, 1430, 1480, 1500, 1470, 1520, 1490, 1530, 1510, 1550, 1580, 1540, 1600, 1570, 1620, 1590, 1640, 1610, 1660, 1630, 1620, 980]},
            {"name": "Customer Satisfaction", "data": [92, 93, 91, 94, 95, 93, 92, 94, 95, 96, 94, 93, 95, 94, 96, 93, 95, 94, 96, 97, 95, 94, 96, 95, 97, 96, 95, 97, 96, 98, 75]},
            {"name": "Active Representatives", "data": [45, 46, 45, 47, 46, 48, 47, 48, 49, 47, 48, 50, 49, 48, 50, 49, 51, 50, 52, 51, 50, 52, 51, 53, 52, 51, 53, 52, 54, 53, 32]}
        ]
    },
    "South": {
        "manager": "Michael Rodriguez",
        "email": "michael.rodriguez@example.com",
        "metrics": [
            {"name": "Sales per Day", "data": [980, 1050, 1020, 1070, 1100, 1080, 1120, 1090, 1130, 1150, 1140, 1160, 1170, 1150, 1190, 1170, 1210, 1190, 1230, 1250, 1220, 1260, 1240, 1280, 1260, 1290, 1270, 1310, 1290, 1300, 1230]},
            {"name": "Customer Satisfaction", "data": [88, 89, 90, 89, 91, 90, 92, 91, 90, 92, 91, 93, 92, 91, 93, 92, 94, 93, 92, 94, 93, 95, 94, 93, 95, 94, 96, 95, 94, 96, 94]},
            {"name": "Active Representatives", "data": [38, 39, 38, 40, 39, 41, 40, 42, 41, 40, 42, 41, 43, 42, 41, 43, 42, 44, 43, 42, 44, 43, 45, 44, 43, 45, 44, 46, 45, 44, 43]}
        ]
    },
    "East": {
        "manager": "Emily Chen",
        "email": "emily.chen@example.com",
        "metrics": [
            {"name": "Sales per Day", "data": [1100, 1130, 1120, 1150, 1180, 1170, 1200, 1190, 1220, 1240, 1230, 1260, 1250, 1280, 1270, 1300, 1290, 1320, 1310, 1340, 1330, 1360, 1350, 1380, 1370, 1400, 1390, 1420, 1410, 1430, 780]},
            {"name": "Customer Satisfaction", "data": [90, 91, 90, 92, 91, 93, 92, 91, 93, 92, 94, 93, 92, 94, 93, 95, 94, 93, 95, 94, 96, 95, 94, 96, 95, 97, 96, 95, 97, 96, 82]},
            {"name": "Active Representatives", "data": [42, 43, 42, 44, 43, 45, 44, 46, 45, 44, 46, 45, 47, 46, 45, 47, 46, 48, 47, 46, 48, 47, 49, 48, 47, 49, 48, 50, 49, 48, 35]}
        ]
    },
    "West": {
        "manager": "David Wilson",
        "email": "david.wilson@example.com",
        "metrics": [
            {"name": "Sales per Day", "data": [1300, 1330, 1320, 1350, 1340, 1370, 1360, 1390, 1380, 1410, 1400, 1430, 1420, 1450, 1440, 1470, 1460, 1490, 1480, 1510, 1500, 1530, 1520, 1550, 1540, 1570, 1560, 1590, 1580, 1610, 1590]},
            {"name": "Customer Satisfaction", "data": [93, 94, 93, 95, 94, 96, 95, 94, 96, 95, 97, 96, 95, 97, 96, 98, 97, 96, 98, 97, 99, 98, 97, 99, 98, 97, 99, 98, 99, 98, 97]},
            {"name": "Active Representatives", "data": [48, 49, 48, 50, 49, 51, 50, 52, 51, 50, 52, 51, 53, 52, 51, 53, 52, 54, 53, 52, 54, 53, 55, 54, 53, 55, 54, 56, 55, 54, 53]}
        ]
    }
}

# Dummy data for the Stock Trading Bot demo
stock_bot_performance = {
    "dates": ["2023-01-01", "2023-01-08", "2023-01-15", "2023-01-22", "2023-01-29", 
              "2023-02-05", "2023-02-12", "2023-02-19", "2023-02-26", "2023-03-05",
              "2023-03-12", "2023-03-19", "2023-03-26", "2023-04-02", "2023-04-09",
              "2023-04-16", "2023-04-23", "2023-04-30", "2023-05-07", "2023-05-14",
              "2023-05-21", "2023-05-28", "2023-06-04", "2023-06-11", "2023-06-18",
              "2023-06-25", "2023-07-02", "2023-07-09", "2023-07-16", "2023-07-23",
              "2023-07-30", "2023-08-06", "2023-08-13", "2023-08-20", "2023-08-27",
              "2023-09-03", "2023-09-10", "2023-09-17", "2023-09-24", "2023-10-01",
              "2023-10-08", "2023-10-15", "2023-10-22", "2023-10-29", "2023-11-05",
              "2023-11-12", "2023-11-19", "2023-11-26", "2023-12-03", "2023-12-10",
              "2023-12-17", "2023-12-24"],
    "algorithm_1": [100, 102, 105, 108, 112, 116, 119, 124, 127, 131,
                    134, 138, 142, 146, 151, 155, 160, 164, 168, 173,
                    177, 183, 188, 193, 199, 203, 208, 214, 219, 225,
                    230, 236, 241, 247, 253, 259, 265, 271, 277, 283,
                    289, 295, 301, 308, 315, 322, 329, 336, 343, 350,
                    358, 365],
    "algorithm_2": [100, 103, 107, 110, 115, 119, 124, 128, 133, 138,
                    143, 148, 153, 159, 164, 169, 174, 179, 184, 189,
                    194, 200, 206, 211, 217, 222, 228, 233, 239, 244,
                    249, 255, 260, 266, 272, 277, 283, 289, 294, 299,
                    304, 309, 313, 318, 323, 328, 332, 337, 341, 346,
                    350, 355],
    "algorithm_3": [100, 101, 99, 102, 103, 105, 106, 108, 107, 109,
                    111, 112, 114, 116, 115, 117, 119, 121, 122, 124,
                    126, 128, 129, 131, 133, 134, 132, 133, 135, 137,
                    139, 138, 140, 142, 144, 146, 147, 149, 148, 150,
                    152, 153, 155, 157, 159, 161, 160, 162, 164, 166,
                    168, 170],
    "sp500": [100, 102, 103, 105, 108, 110, 113, 115, 118, 120,
              123, 125, 128, 131, 134, 137, 140, 143, 146, 149,
              152, 155, 158, 161, 164, 167, 171, 174, 177, 180,
              183, 187, 190, 194, 197, 201, 204, 207, 210, 214,
              217, 221, 224, 227, 231, 234, 238, 241, 245, 248,
              252, 255]
}

stock_confidence_data = [
    {"ticker": "AAPL", "confidence": 92, "prediction": "up", "factors": ["Positive news sentiment", "Strong earnings report", "Upcoming product launch"]},
    {"ticker": "MSFT", "confidence": 88, "prediction": "up", "factors": ["Cloud services growth", "AI investments", "Strong market position"]},
    {"ticker": "GOOGL", "confidence": 85, "prediction": "up", "factors": ["Ad revenue growth", "AI innovations", "Regulatory concerns easing"]},
    {"ticker": "AMZN", "confidence": 79, "prediction": "up", "factors": ["E-commerce growth", "AWS expansion", "Logistics improvements"]},
    {"ticker": "TSLA", "confidence": 76, "prediction": "up", "factors": ["Production increase", "New models", "Energy division growth"]},
    {"ticker": "META", "confidence": 72, "prediction": "up", "factors": ["Ad targeting improvements", "Metaverse investments", "Cost cutting measures"]},
    {"ticker": "NVDA", "confidence": 94, "prediction": "up", "factors": ["AI chip demand", "Data center growth", "Gaming segment recovery"]},
    {"ticker": "AMD", "confidence": 81, "prediction": "up", "factors": ["Market share gains", "New product releases", "Server segment growth"]},
    {"ticker": "JPM", "confidence": 65, "prediction": "up", "factors": ["Interest rate environment", "Investment banking activity", "Consumer banking strength"]},
    {"ticker": "PFE", "confidence": 45, "prediction": "down", "factors": ["Patent expirations", "Pipeline concerns", "Market competition"]},
    {"ticker": "KO", "confidence": 68, "prediction": "up", "factors": ["International growth", "Product diversification", "Brand strength"]},
    {"ticker": "DIS", "confidence": 71, "prediction": "up", "factors": ["Streaming subscriber growth", "Park attendance increase", "Content pipeline"]}
]

# Dummy data for the Thesis tool
thesis_statements = [
    {"id": 1, "statement": "Social media is bad for our society"},
    {"id": 2, "statement": "Artificial intelligence will eventually replace most human jobs"},
    {"id": 3, "statement": "Climate change should be the top priority for all governments"},
    {"id": 4, "statement": "Cryptocurrency is the future of financial transactions"},
    {"id": 5, "statement": "Remote work is more productive than office work"},
    {"id": 6, "statement": "College education is becoming less valuable in today's job market"}
]

# Arguments for statement 1
arguments_1_agree = [
    {"id": 1, "text": "Social media creates echo chambers that reinforce existing beliefs and prevent exposure to diverse viewpoints", "user": "user123", "votes": 24},
    {"id": 2, "text": "The addictive nature of social media platforms negatively impacts mental health, particularly among young people", "user": "socialcritic", "votes": 42},
    {"id": 3, "text": "Social media companies prioritize engagement over user wellbeing, leading to algorithms that promote divisive content", "user": "techethics", "votes": 35},
    {"id": 4, "text": "The spread of misinformation on social platforms has real-world consequences for public health and democratic processes", "user": "factchecker", "votes": 29}
]

arguments_1_disagree = [
    {"id": 1, "text": "Social media allows marginalized groups to have a voice and connect with others who share their experiences", "user": "connecter", "votes": 31},
    {"id": 2, "text": "These platforms enable rapid organization for social movements and humanitarian efforts", "user": "activist92", "votes": 27},
    {"id": 3, "text": "Social media has democratized information access, breaking down traditional gatekeeping structures", "user": "infofreedom", "votes": 19},
    {"id": 4, "text": "It provides valuable tools for businesses, especially small ones, to reach customers without massive marketing budgets", "user": "smallbizowner", "votes": 23}
]

# Arguments for statement 2
arguments_2_agree = [
    {"id": 1, "text": "AI systems are already showing capabilities to automate tasks across multiple industries including law, medicine, and customer service", "user": "futurist", "votes": 18},
    {"id": 2, "text": "The rate of AI improvement is exponential, and humans won't be able to compete in many task-oriented jobs", "user": "techwatcher", "votes": 22}
]

arguments_2_disagree = [
    {"id": 1, "text": "AI will create more jobs than it eliminates as new industries emerge around the technology", "user": "techoptimist", "votes": 15},
    {"id": 2, "text": "Human creativity, emotional intelligence, and ethical decision-making cannot be replicated by AI", "user": "humanfirst", "votes": 29}
]

# Sample related arguments for similarity checking
similar_arguments = {
    "Social media is making people more isolated despite appearing to connect them": [
        {"id": 2, "text": "The addictive nature of social media platforms negatively impacts mental health, particularly among young people", "similarity": 0.82},
        {"id": 3, "text": "Social media companies prioritize engagement over user wellbeing, leading to algorithms that promote divisive content", "similarity": 0.65}
    ],
    "AI will make human workers obsolete in many industries": [
        {"id": 1, "text": "AI systems are already showing capabilities to automate tasks across multiple industries including law, medicine, and customer service", "similarity": 0.91}
    ]
}

# Simulated user database
users = {
    "user123": {
        "id": 1,
        "username": "user123",
        "password": hashlib.sha256("securepass123".encode()).hexdigest(),
        "statement_positions": {
            "1": "agree",
            "2": "disagree",
            "3": None,
            "4": "agree",
            "5": None,
            "6": "disagree"
        }
    },
    "jackson": {
        "id": 2,
        "username": "jackson",
        "password": hashlib.sha256("portfolio".encode()).hexdigest(),
        "statement_positions": {
            "1": None,
            "2": None,
            "3": None,
            "4": None,
            "5": None,
            "6": None
        }
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/faiss-demo')
def faiss_demo():
    return render_template('faiss_demo.html')

@app.route('/qa-checks-demo')
def qa_checks_demo():
    return render_template('qa_checks_demo.html', regions=qa_regions)

@app.route('/stock-bot-demo')
def stock_bot_demo():
    return render_template('stock_bot_demo.html', 
                          performance_data=stock_bot_performance,
                          confidence_data=stock_confidence_data)

@app.route('/thesis-demo')
def thesis_demo():
    # No longer need to check for user login
    return render_template('thesis_demo.html')

@app.route('/thesis-login', methods=['POST'])
def thesis_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if username in users and users[username]['password'] == hashlib.sha256(password.encode()).hexdigest():
        session['username'] = username
        return jsonify({"success": True, "user": users[username]})
    else:
        return jsonify({"success": False, "message": "Invalid username or password"})

@app.route('/thesis-register', methods=['POST'])
def thesis_register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # Check if username already exists
    if username in users:
        return jsonify({"success": False, "message": "Username already exists"})
    
    # Create new user
    user_id = len(users) + 1
    users[username] = {
        "id": user_id,
        "username": username,
        "password": hashlib.sha256(password.encode()).hexdigest(),
        "statement_positions": {str(s["id"]): None for s in thesis_statements}
    }
    
    session['username'] = username
    return jsonify({"success": True, "user": users[username]})

@app.route('/thesis-logout')
def thesis_logout():
    session.pop('username', None)
    return redirect(url_for('thesis_demo'))

@app.route('/api/thesis/statement/<int:statement_id>')
def get_statement(statement_id):
    for statement in thesis_statements:
        if statement["id"] == statement_id:
            return jsonify({"success": True, "statement": statement})
    
    return jsonify({"success": False, "message": "Statement not found"})

@app.route('/api/thesis/vote', methods=['POST'])
def record_vote():
    if 'username' not in session:
        return jsonify({"success": False, "message": "User not logged in"})
    
    data = request.json
    statement_id = str(data.get('statement_id'))
    position = data.get('position')  # 'agree' or 'disagree'
    
    username = session['username']
    if username in users:
        users[username]['statement_positions'][statement_id] = position
        return jsonify({"success": True})
    
    return jsonify({"success": False, "message": "User not found"})

@app.route('/api/thesis/arguments/<int:statement_id>/<string:position>')
def get_arguments(statement_id, position):
    if statement_id == 1:
        if position == "agree":
            return jsonify({"success": True, "arguments": arguments_1_agree})
        else:
            return jsonify({"success": True, "arguments": arguments_1_disagree})
    elif statement_id == 2:
        if position == "agree":
            return jsonify({"success": True, "arguments": arguments_2_agree})
        else:
            return jsonify({"success": True, "arguments": arguments_2_disagree})
    else:
        # For other statements, return empty for demonstration purposes
        return jsonify({"success": True, "arguments": []})

@app.route('/api/thesis/check-similarity', methods=['POST'])
def check_similarity():
    data = request.json
    argument = data.get('argument', '')
    
    # Simulate processing time
    time.sleep(1.5)
    
    # Return pre-defined results for specific test queries
    if "social media" in argument.lower() and "isolated" in argument.lower():
        return jsonify({
            "success": True, 
            "similar_arguments": similar_arguments["Social media is making people more isolated despite appearing to connect them"]
        })
    elif "ai" in argument.lower() and "obsolete" in argument.lower():
        return jsonify({
            "success": True, 
            "similar_arguments": similar_arguments["AI will make human workers obsolete in many industries"]
        })
    
    # Default: no similar arguments found
    return jsonify({"success": True, "similar_arguments": []})

@app.route('/api/thesis/submit-argument', methods=['POST'])
def submit_argument():
    if 'username' not in session:
        return jsonify({"success": False, "message": "User not logged in"})
    
    data = request.json
    statement_id = data.get('statement_id')
    position = data.get('position')
    argument_text = data.get('argument')
    
    # Simulate argument submission - would actually store in database
    # Show success for demo purposes
    return jsonify({
        "success": True, 
        "message": "Argument submitted successfully",
        "opposing_arguments": arguments_1_disagree if position == "agree" else arguments_1_agree
    })

@app.route('/api/thesis/debate', methods=['POST'])
def generate_debate():
    data = request.json
    statement_id = data.get('statement_id')
    user_argument = data.get('argument')
    position = data.get('position')
    
    # In a real application, this would use an LLM to generate a response
    # For the demo, we'll return a predefined response
    
    time.sleep(2)  # Simulate processing time
    
    opposing_position = "disagree" if position == "agree" else "agree"
    
    examples = {
        1: {
            "agree": "While I understand your point that social media has negative impacts on society, I'd like to highlight that these platforms have democratized information access, breaking down traditional gatekeeping structures. They also allow marginalized groups to have a voice and connect with others who share their experiences. Additionally, social media enables rapid organization for social movements and humanitarian efforts, demonstrating its positive potential when used properly.",
            "disagree": "I appreciate your perspective on the benefits of social media, but research consistently shows these platforms create echo chambers that reinforce existing beliefs and prevent exposure to diverse viewpoints. The addictive design of these services negatively impacts mental health, particularly among young people. Furthermore, algorithms that prioritize engagement over wellbeing promote divisive content, and the rapid spread of misinformation has demonstrable negative impacts on public health and democratic processes."
        },
        2: {
            "agree": "While AI will certainly transform the workplace, there's strong evidence it will create more jobs than it eliminates as new industries emerge around the technology. Throughout history, technological advancements have shifted labor needs rather than eliminating them entirely. Additionally, uniquely human qualities like creativity, emotional intelligence, and ethical decision-making cannot be replicated by AI, suggesting humans will remain essential in many roles.",
            "disagree": "The current wave of AI advancement is fundamentally different from previous technological revolutions. AI systems are already demonstrating capabilities to automate complex tasks across industries including law, medicine, and customer service - domains previously thought to require human intelligence. The rate of improvement is exponential, and economic incentives strongly favor automation. While some new jobs will emerge, they will likely be insufficient to replace those eliminated, leading to significant workforce disruption."
        }
    }
    
    if statement_id in examples and opposing_position in examples[statement_id]:
        response = examples[statement_id][opposing_position]
    else:
        response = "This would be a thoughtful response that presents counterarguments to your position, drawing from the collective knowledge in our argument database. In a full implementation, this would leverage an LLM trained on opposing viewpoints."
    
    return jsonify({
        "success": True,
        "debate_response": response
    })

@app.route('/api/faiss-query', methods=['POST'])
def faiss_query():
    data = request.json
    query = data.get('query', '')
    
    # Simulate processing time
    import time
    time.sleep(1.5)
    
    # Return pre-defined results based on the query
    results = faiss_results.get(query, [])
    return jsonify({"results": results})

@app.route('/api/qa-analysis', methods=['POST'])
def qa_analysis():
    data = request.json
    region = data.get('region', '')
    
    # Simulate processing time
    import time
    time.sleep(2)
    
    if region in qa_regions:
        region_data = qa_regions[region]
        
        # Create analysis results
        analysis_results = {
            "region": region,
            "manager": region_data["manager"],
            "email": region_data["email"],
            "metrics": []
        }
        
        for metric in region_data["metrics"]:
            metric_data = metric["data"]
            
            # Calculate 30-day average (excluding the last day)
            avg_30_days = sum(metric_data[:-1]) / 29
            
            # Check last 7 days
            last_7_days = metric_data[-7:]
            anomalies = []
            
            for i, day_value in enumerate(last_7_days):
                day_index = 30 - 7 + i
                percent_diff = ((day_value - avg_30_days) / avg_30_days) * 100
                
                # If value is 15% below average, flag it
                if percent_diff < -15:
                    anomalies.append({
                        "day": day_index + 1,
                        "value": day_value,
                        "avg": avg_30_days,
                        "percent_diff": percent_diff
                    })
            
            analysis_results["metrics"].append({
                "name": metric["name"],
                "average": avg_30_days,
                "last_value": metric_data[-1],
                "all_values": metric_data,
                "anomalies": anomalies
            })
        
        return jsonify({"success": True, "analysis": analysis_results})
    else:
        return jsonify({"success": False, "error": "Region not found"})

if __name__ == '__main__':
    app.run(debug=True, port=8080) 