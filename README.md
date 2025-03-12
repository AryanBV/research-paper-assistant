# Research Paper Assistant Web App

A full-stack web application that generates IEEE-formatted research papers based on user-provided inputs, complete with AI-powered content generation capabilities.

## 🚀 Features

- **User Input Form**:
  - Research paper title, abstract, keywords
  - Multiple author support with corresponding author designation
  - Section content with intelligent AI-powered generation
  - Reference management system

- **File Handling**:
  - Upload images and graphs
  - AI-powered automatic caption generation
  - Proper integration into IEEE format

- **IEEE-Compliant Formatting**:
  - Two-column layout
  - Proper heading styles and citation formats
  - Author formatting with superscript affiliations
  - Reference structuring as per IEEE standards

- **PDF Export**:
  - Download generated research papers as IEEE-formatted PDF
  - High-quality typesetting and layout

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryanbv/research-paper-assistant.git
   cd research-paper-assistant
   ```

2. **Setup environment variables**
   ```bash
   # Copy example environment file
   cp .env.example .env
   
   # Edit .env file with your database credentials
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

5. **Initialize database**
   ```bash
   # Return to server directory
   cd ../server
   
   # Run database initialization script
   node utils/db-init.js
   ```

## 🏃‍♂️ Running the Application

1. **Start the server**
   ```bash
   # From the server directory
   npm run dev
   ```

2. **Start the client (in a new terminal)**
   ```bash
   # From the client directory
   npm start
   ```

3. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
research-paper-assistant/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/                 # React source code
│       ├── components/      # UI components
│       ├── pages/           # Page components
│       └── services/        # API services
├── server/                  # Node.js backend
│   ├── config/              # Server configuration
│   ├── controllers/         # API controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── uploads/             # File uploads storage
│   └── utils/               # Utility functions
└── .env.example             # Example environment variables
```

## 💻 Technologies Used

### Frontend
- React.js
- React Router
- Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- Multer (file handling)
- html-pdf-node (PDF generation)

## 🧪 Sample Paper for Testing

### Paper Details
- **Title**: Deep Learning Approaches for Medical Image Analysis

- **Abstract**: 
  This paper explores the application of deep learning techniques in medical image analysis. We review recent advances in convolutional neural networks and their applications in radiology, pathology, and other medical imaging domains. Our analysis shows that deep learning models can achieve comparable or superior performance to human experts in certain diagnostic tasks. We discuss both the potential benefits and limitations of these approaches in clinical settings.

- **Keywords**: 
  deep learning, medical imaging, convolutional neural networks, radiology, diagnostics

### Authors
1. **Name**: John Smith  
   **Department**: Department of Computer Science  
   **University**: Stanford University  
   **City**: Stanford  
   **Country**: USA  
   **Email**: john.smith@stanford.edu  
   **Corresponding Author**: Yes

2. **Name**: Maria Rodriguez  
   **Department**: Department of Radiology  
   **University**: Harvard Medical School  
   **City**: Boston  
   **Country**: USA  
   **Email**: m.rodriguez@harvard.edu  
   **Corresponding Author**: No

3. **Name**: Wei Zhang  
   **Department**: Department of Artificial Intelligence  
   **University**: Tsinghua University  
   **City**: Beijing  
   **Country**: China  
   **Email**: wei.zhang@tsinghua.edu.cn  
   **Corresponding Author**: No

### Sections
- **Introduction**: (Leave empty to test AI generation)

- **Methodology**:  
  Our methodology involved a systematic review of deep learning approaches in medical imaging published between 2015 and 2023. We categorized techniques based on network architecture, imaging modality, and clinical application. We compared performance metrics including accuracy, sensitivity, specificity, and area under the ROC curve across different studies.

- **Results**:  
  Our analysis identified 150 relevant studies across multiple imaging modalities. Convolutional neural networks were the dominant architecture (78% of studies), followed by transformer-based models (12%). Classification tasks showed the highest average accuracy (92.3%), followed by segmentation (89.7%) and detection (85.2%).

- **Discussion**: (Leave empty to test AI generation)

- **Conclusion**:  
  Deep learning approaches show significant promise for medical image analysis, with performance metrics increasingly comparable to human experts. However, challenges remain in interpretability, generalizability across diverse patient populations, and integration into existing clinical workflows.

### References
- **Author**: Smith, J. et al.  
  **Title**: A Survey of Deep Learning in Medical Image Analysis  
  **Publication**: IEEE Transactions on Medical Imaging  
  **Year**: 2021  
  **URL**: https://example.com/smith2021

- **Author**: Wang, L. and Chen, H.  
  **Title**: Deep Neural Networks for Radiological Image Interpretation  
  **Publication**: Journal of Medical AI  
  **Year**: 2022

- **Author**: Patel, A. et al.  
  **Title**: Clinical Validation of AI-Based Diagnostic Tools  
  **Publication**: Nature Medicine  
  **Year**: 2020

### Image
Upload any image file (preferably something that looks like a medical scan or graph) to test the AI captioning.