# GENZOIC

> A unified dashboard for real‑time market insights—combining intuitive frontend visuals with a robust backend API powered by Docker.

##  Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Configuration](#configuration)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

### About

GENZOIC is a full-stack application that delivers live market data insights. The backend serves APIs to gather and process financial data, while the frontend visualizes real-time trends. The Alpha Vantage API will not work you'll have to wait as I have exhausted the number of API hits for today.

### Features

- Interactive frontend UI to display real-time market statistics
- Clean separation of backend logic and frontend visuals
- Portable deployment via Docker containers
- Modular folder structure for easy maintenance and scalability

### Tech Stack

| Component          | Technologies Used                         |
|-------------------|-------------------------------------------|
| **Backend**        | JavaScript (Node.js/Express, etc.)        |
| **Frontend**       | HTML, CSS, JavaScript (React/Vue, etc.)   |
| **Containerization** | Docker, `docker-compose`                 |

### Getting Started

#### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

#### Local Setup

```bash
# Clone the repo
git clone https://github.com/Karan28272827/GENZOIC.git
cd GENZOIC

# Start backend
cd market-pulse-backend
npm install
npm start

# In a new terminal, start frontend
cd market-pulse-frontend
npm install
npm start
