# Static Website with Tailwind CSS

A simple static website built with HTML, CSS, JavaScript, and Tailwind CSS.

## Features

- Modern, responsive design
- Dark mode toggle
- Smooth scrolling navigation
- Mobile-friendly layout
- Built with Tailwind CSS for utility-first styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server and watch for CSS changes:

```bash
npm run watch
```

In a separate terminal, start the local server:

```bash
npm start
```

### Building for Production

To build the CSS for production:

```bash
npm run build
```

## Project Structure

```
.
├── src/
│   ├── index.html
│   ├── input.css
│   └── js/
│       └── main.js
├── dist/
│   └── output.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Customization

- Edit `src/input.css` to modify Tailwind CSS styles
- Update `tailwind.config.js` to customize the Tailwind configuration
- Modify `src/index.html` to change the website content
- Edit `src/js/main.js` to add or modify JavaScript functionality 