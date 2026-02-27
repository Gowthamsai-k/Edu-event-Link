# EduEventLink

EduEventLink is a minimal, modern platform built to help students discover events and join student communities within their university. The frontend has been designed from the ground up to be responsive, engaging, and dynamic, employing technologies like React, Vite, Framer Motion, and Tailwind-like utility classes (via custom CSS).

## 🚀 Features

- **Event Discovery:** Browse and search for upcoming campus events effortlessly.
- **Community Hub:** A dedicated space for student organizations to connect with members.
- **Authentication:** Simple, secure login and signup flows with protected routes.
- **Modern UI:** Built with dynamic animations and a sleek, premium design.

## 🛠️ Technology Stack

- **Framework:** React 19 (via Vite)
- **Routing:** React Router v7
- **Styling:** Custom CSS (Modular, Utility-first approach)
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📁 Project Structure

The frontend application now resides in the root directory for a streamlined development experience:

```
EduEventLink/
├── public/               # Static assets
├── src/                  # Application source code
│   ├── assets/           # Images, SVGs, etc.
│   ├── components/       # Reusable React components (Navbar, Footer, Hero, etc.)
│   ├── context/          # React context (AuthContext)
│   ├── pages/            # Top-level view components (Home, Events, Community, Login, Signup)
│   ├── App.jsx           # Main application routing
│   ├── App.css           # Global component styles
│   ├── index.css         # Global design system & utility classes
│   └── main.jsx          # Application entry point
├── .gitignore
├── eslint.config.js      # Linting rules
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
└── vite.config.js        # Vite bundler configuration
```

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have **Node.js** (v18+ recommended) and **npm** installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Gowthamsai-k/Edu-event-Link.git
   cd Edu-event-Link
   ```

2. Install NPM packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 📦 Building for Production

To create a production build, run:
```bash
npm run build
```
This will compile the application into the `dist` directory, ready to be deployed.

## 📄 License

This project is open-source and available under the MIT License.
