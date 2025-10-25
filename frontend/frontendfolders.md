frontend/
│
├── node_modules/                           # 📦 Installed dependencies
│
├── public/                                 # 🌐 Publicly accessible files
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
│
├── src/                                    # 💻 Main source code
│   │
│   ├── assets/                             # 🖼️ Static files
│   │   ├── logo.jpg
│   │   ├── logo2.jpg
│   │   └── main logo.jpg
│   │
│   ├── components/                         # 🧩 Reusable UI parts
│   │   ├── Header/
│   │   │   └── Header.jsx
│   │   └── Footer/
│   │       └── Footer.jsx
│   │
│   ├── pages/                              # 📄 Application Pages
│   │   │
│   │   ├── admin/                          # 🧠 Admin Section
│   │   │   ├── AdminDashboard.jsx          # Overview dashboard
│   │   │   ├── AdminHeader.jsx             # Top navigation bar
│   │   │   ├── AdminHome.jsx               # Default admin landing page
│   │   │   ├── AdminSidebar.jsx            # Sidebar menu
│   │   │   ├── Contacts.jsx                # View all contact messages
│   │   │   ├── Feedbacks.jsx               # Manage all user feedback
│   │   │   ├── Premiums.jsx                # Manage premium plans/users
│   │   │   └── Visitors.jsx                # Website visitors analytics
│   │   │
│   │   ├── tools/                          # 🛠️ PDF & Document Tools
│   │   │   ├── pdf-to-word.jsx
│   │   │   ├── word-to-pdf.jsx
│   │   │   ├── pdf-merge.jsx
│   │   │   ├── pdf-split.jsx
│   │   │   ├── pdf-compress.jsx
│   │   │   ├── pdf-editor.jsx
│   │   │   ├── image-to-pdf.jsx
│   │   │   ├── pdf-to-image.jsx
│   │   │   ├── password-protect.jsx
│   │   │   ├── unlock-pdf.jsx
│   │   │   ├── excel-to-pdf.jsx
│   │   │   ├── powerpoint-to-pdf.jsx
│   │   │   ├── esign-pdf.jsx
│   │   │   └── doc-translator.jsx
│   │   │
│   │   ├── About.jsx
│   │   ├── ComingSoon.jsx
│   │   ├── Contact.jsx
│   │   ├── CreateDoc.jsx
│   │   ├── DocAI.jsx
│   │   ├── Favorites.jsx
│   │   ├── Feedback.jsx
│   │   ├── HelpCenter.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Profile.jsx
│   │   ├── Signup.jsx
│   │   ├── Tools.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── App.jsx                             # 🚀 Root Component (includes routing)
│   ├── index.css                           # 🎨 TailwindCSS base styles
│   ├── index.js                            # ⚙️ Entry point for React
│   └── main.jsx                            # 🔗 React rendering setup
│
├── .env                                    # 🔐 Environment variables (API URL)
├── .gitignore                              # 🚫 Ignored files for Git
├── package.json                            # 📦 Project metadata and dependencies
├── package-lock.json                       # 🔒 Dependency lock file
├── postcss.config.js                       # ⚙️ PostCSS config for Tailwind
├── tailwind.config.js                      # 🎨 Tailwind custom theme setup
└── README.md                               # 📘 Documentation
