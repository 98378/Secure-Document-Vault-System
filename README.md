# SecureVaultX 🔐

SecureVaultX is a secure document management and integrity verification platform developed using Node.js, Express.js, MongoDB, and modern cybersecurity techniques.

The system provides secure authentication, encrypted document storage, role-based access control, integrity verification, and HTTPS communication protection.

---

# 🚀 Features

## 🔐 Authentication & Security

* User Registration & Login
* Password Hashing using bcrypt
* JWT Authentication
* Google OAuth Login
* Two-Factor Authentication (2FA) using Google Authenticator
* Logout Functionality
* Rate Limiting
* Helmet Security Middleware

---

## 👥 Role-Based Access Control (RBAC)

### Admin

* Manage users
* View security logs
* Monitor threat alerts

### Manager

* Verify document integrity
* Review uploaded documents

### User

* Upload encrypted documents
* Download documents
* Delete personal documents

---

## 📂 Secure Document Management

* Upload Documents
* Download Documents
* Delete Documents
* View Document Metadata
* File Type Validation
* File Size Validation

---

## 🔒 Document Encryption

Uploaded documents are encrypted before storage using AES-256 encryption.

---

## 🛡️ Integrity Verification

* SHA-256 Hash Generation
* Digital Signature Verification
* Tamper Detection
* Integrity Validation

---

## 🌐 HTTPS & Secure Communication

* HTTPS Enabled using SSL Certificates
* Secure Communication using TLS
* HTTP → HTTPS Redirection

---

## 🕵️ Wireshark MITM Demonstration

The project demonstrates:

* HTTP insecure traffic inspection
* HTTPS encrypted communication
* Protection against MITM attacks

---

# 🛠️ Technologies Used

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Passport.js
* Google OAuth
* Speakeasy
* QRCode
* Crypto (AES-256 / SHA-256)
* Multer
* Helmet
* HTTPS / TLS
* Wireshark


# 👨‍💻 Project Requirements Covered

✅ Authentication and User Management
✅ RBAC
✅ Secure Document Management
✅ AES-256 Encryption
✅ SHA-256 Integrity Verification
✅ HTTPS Secure Communication
✅ Wireshark MITM Demonstration

---

# 📄 License

This project is developed for educational and cybersecurity training purposes.
