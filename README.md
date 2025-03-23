# Jackson Franco Portfolio Website

A personal portfolio website built with Flask to showcase projects and skills, featuring interactive demos of machine learning applications.

## Features

- Responsive design using Bootstrap 5
- Project showcase with detailed descriptions
- Interactive FAISS document similarity search demo
- Contact information and social links

## Getting Started

### Prerequisites

- Python 3.13 or higher
- pip (Python package installer)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/jackson-portfolio.git
   cd jackson-portfolio
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask development server:
   ```
   python app.py
   ```

2. Open a web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
.
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── static/                 # Static files
│   ├── css/                # CSS stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Images
└── templates/              # HTML templates
    ├── layout.html         # Base template
    ├── index.html          # Homepage
    ├── projects.html       # Projects listing
    └── faiss_demo.html     # FAISS demo page
```

## Customization

- Edit the content in the HTML templates to personalize the website
- Update the CSS in `static/css/style.css` to change the styling
- Add your own projects to the `projects.html` template
- Create additional demo pages for other projects

## Adding New Projects

1. Add the project details to `projects.html`
2. Create a new route in `app.py` if needed
3. Create a new template for the project demo if applicable
4. Update the navigation links in `layout.html` if necessary

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Easter eggs: 

Main Page Easter Egg: It tracks user key presses and compares them to the Konami sequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
Thesis Page Easter Egg: On the Thesis demo page, there's a small comments icon at the top that you can click repeatedly. After every 3 clicks, you'll see a popup with an AI-themed joke. The counter shows how many times you've clicked, and there are 10 different jokes to discover.
Stock Bot Page Easter Egg: On the Stock Trading Bot demo page, all the stock tickers (like AAPL, TSLA, etc.) are now clickable. When you click any ticker repeatedly, it will shake and display a counter. Every 3 clicks, you'll get a funny stock market joke in a popup at the bottom of the screen.