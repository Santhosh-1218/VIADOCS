
frontend/
│
├── node_modules/ # Dependencies installed by npm or yarn
├── public/ # Publicly accessible files (index.html, icons, etc.)
│
├── src/ # Main source code
│ ├── assets/ # Static assets (images, logos, icons, etc.)
│ │ ├── logo.jpg
│ │ ├── logo2.jpg
│ │ └── main logo.jpg
│ │
│ ├── components/ # Reusable UI components
│ │ ├── Header/
│ │ │ └── Header.jsx
│ │ └── Footer/
│ │ └── Footer.jsx
│ │
│ ├── pages/ # Main application pages   
│ │ ├── tools/ # PDF and document conversion tools    #14 tools 
│ │ │ ├── doc-translator.jsx
│ │ │ ├── esign-pdf.jsx
│ │ │ ├── excel-to-pdf.jsx
│ │ │ ├── image-to-pdf.jsx
│ │ │ ├── password-protect.jsx
│ │ │ ├── pdf-compress.jsx
│ │ │ ├── pdf-editor.jsx
│ │ │ ├── pdf-merge.jsx
│ │ │ ├── pdf-split.jsx
│ │ │ ├── pdf-to-image.jsx
│ │ │ ├── pdf-to-word.jsx
│ │ │ ├── powerpoint-to-pdf.jsx
│ │ │ ├── unlock-pdf.jsx
│ │ │ └── word-to-pdf.jsx
│ │ │
│ │ ├── About.jsx
│ │ ├── ComingSoon.jsx
│ │ ├── Contact.jsx
│ │ ├── CreateDoc.jsx
│ │ ├── DocAI.jsx
│ │ ├── Favorites.jsx
│ │ ├── Feedback.jsx
│ │ ├── HelpCenter.jsx
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── PrivacyPolicy.jsx
│ │ ├── Profile.jsx
│ │ ├── Signup.jsx
│ │ └── Tools.jsx
| | |___ForgotPassword.jsx
│ │
│ ├── App.jsx # Root component
│ ├── index.css # Global CSS (import Tailwind here)
│ ├── index.js # React entry point
│ └── main.jsx # App rendering and routes
│
├── .env # Environment variables
├── .gitignore # Files and folders to ignore in Git
├── package.json # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── postcss.config.js # PostCSS configuration for Tailwind
├── tailwind.config.js # Tailwind CSS custom configuration
└── README.md # Project documentation