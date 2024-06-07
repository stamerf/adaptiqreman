# Intelligent remanufacturing based on optimization of quality classes under uncertainty
[![DOI](https://zenodo.org/badge/811625452.svg)](https://zenodo.org/doi/10.5281/zenodo.11513761)
## Overview

This repository contains the implementation of a manufacturing process planning algorithm. The algorithm is designed to help companies optimize their remanufacturing processes by generating cost-efficient process plans tailored to specific customer demands and available core inventory levels. As of now, a use case is hard coded and the code can be executed directly. The key functionalities of the code include:

1. **Quality Data Modeling**: Accurately modeling the quality of returned products based on multiple quality parameters (cf. hard coded use case in main.ts)
2. **Process Plan Generation**: Creating detailed and optimized process plans for various remanufacturing tasks --> After running the code you can see this in "Remanufacturing_look_up_table.xlsx"
3. **Cost Optimization**: Determining the most cost-effective process plans to fulfill customer orders considering the company’s technological capabilities and inventory levels. --> After running the code you can see this in "Order Management.xlsx"

The code is written in TypeScript and runs on Node.js, utilizing several npm packages to perform various functions including reading and writing Excel files, solving linear programming problems, and measuring performance.

## How to Run

### Prerequisites

Ensure you have Node.js and npm installed on your system. You can download and install Node.js from [here](https://nodejs.org/).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/your-repository.git
   cd your-repository
   ```

2. **Install TypeScript and Dependencies**

   Install TypeScript globally if you haven't already:

   ```bash
   npm install -g typescript
   ```

   Install the project dependencies:

   ```bash
   npm install
   ```

### Build the Code

Compile the TypeScript code into JavaScript:

```bash
tsc
```

### Run the Code

Run `main.js`:

```bash
node built/main.js
```