# Jackson Franco - Static Portfolio Website

This is a static version of Jackson Franco's portfolio website, converted from a Flask application to run entirely in the browser using HTML, CSS, and JavaScript.

## 🚀 Features

- **Responsive Design**: Fully responsive layout that works on all devices
- **Interactive Demos**: Four comprehensive project demonstrations
- **Modern UI**: Clean, professional design with smooth animations
- **GitHub Pages Ready**: Optimized for deployment on GitHub Pages

## 📁 Project Structure

```
├── index.html              # Main portfolio page
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   ├── main.js         # Core functionality
│   │   ├── data.js         # Demo data
│   │   ├── faiss-demo.js   # FAISS similarity demo
│   │   ├── qa-demo.js      # QA analytics demo
│   │   ├── stock-demo.js   # Stock trading bot demo
│   │   └── thesis-demo.js  # Thesis discussion platform
│   └── images/             # Image assets (if any)
├── README-static.md        # This file
└── README.md              # Original Flask app documentation
```

## 🔧 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Interactive functionality
- **Bootstrap 5**: UI framework
- **Chart.js**: Data visualization
- **Font Awesome**: Icons
- **Local Storage**: Client-side data persistence

## 🎯 Demo Projects

### 1. FAISS Document Similarity
- Semantic document search simulation
- Vector similarity visualization
- Interactive query interface

### 2. Quality Assurance Analytics
- Business metrics monitoring
- Anomaly detection algorithms
- Interactive charts and dashboards

### 3. Stock Trading Bot
- Algorithmic trading performance comparison
- AI confidence indicators
- Real-time market analysis simulation

### 4. Thesis Discussion Platform
- Collaborative argument development
- AI-powered debate generation
- Similarity checking for arguments
- User authentication with localStorage

## 🚀 Deployment

### GitHub Pages

1. **Fork or Clone** this repository
2. **Enable GitHub Pages** in repository settings
3. **Select source** as "Deploy from a branch"
4. **Choose branch** (usually `main` or `master`)
5. **Your site will be available** at `https://username.github.io/repository-name`

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Serve the files** using any static server:
   ```bash
   # Using Python 3
   python -m http.server 8080
   
   # Using Node.js (http-server)
   npx http-server -p 8080
   
   # Using PHP
   php -S localhost:8080
   ```

3. **Open your browser** and navigate to `http://localhost:8080`

## 🎨 Customization

### Updating Demo Data
Edit `assets/js/data.js` to modify:
- FAISS search results
- QA regional metrics
- Stock trading performance data
- Thesis statements and arguments

### Styling Changes
Modify `assets/css/style.css` to customize:
- Color scheme (CSS variables in `:root`)
- Typography and spacing
- Animation timing and effects
- Responsive breakpoints

### Adding New Demos
1. Create a new JavaScript file in `assets/js/`
2. Add demo initialization function
3. Update `main.js` to include the new demo
4. Add demo card to the projects section in `index.html`

## 🌟 Features & Functionality

### Navigation
- Smooth scrolling between sections
- Active section highlighting
- Mobile-responsive hamburger menu

### Animations
- CSS keyframe animations
- Intersection Observer API for scroll-triggered effects
- Chart.js animations for data visualization

### Data Persistence
- User authentication state (thesis demo)
- User preferences and positions
- Demo interaction history

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Optimized touch interactions

## 🔒 Privacy & Data

This static website:
- **No server-side processing**: All functionality runs in the browser
- **No external API calls**: All data is included in the JavaScript files
- **Local storage only**: User data stays on the device
- **No analytics tracking**: Privacy-focused implementation

## 📝 Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **ES6+ features**: Arrow functions, classes, modules
- **CSS Grid & Flexbox**: Modern layout techniques
- **Local Storage**: For data persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **GitHub**: [@jacksonfranco](https://github.com/jacksonfranco)
- **Email**: jackson@example.com
- **LinkedIn**: Jackson Franco

---

*This static website showcases advanced front-end development skills and demonstrates the conversion of server-side applications to client-side implementations suitable for static hosting platforms like GitHub Pages.* 