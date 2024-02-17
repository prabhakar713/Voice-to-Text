# Voice-to-Text Feature
![Dashboard](https://github.com/prabhakar713/Voice-to-Text/blob/main/Dashboard.PNG)


## Overview

This repository implements a Voice-to-Text feature using the [annyang](https://www.talater.com/annyang/) library in JavaScript. Users can interact with the application using voice commands, converting spoken words into text. This README provides details on dependencies, installation steps, available commands, how they work, and information about the developer.

## Dependencies

The primary dependency for this project is the [annyang](https://www.talater.com/annyang/) library, a lightweight JavaScript library for adding voice commands to web applications. Include this library in your project.

## Installation

To install the necessary packages, follow these steps:

1. Include the annyang library in your project by adding the following script tag to your HTML:

   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js"></script>
   <script src="./backend.js"></script>
Ensure these scripts are included appropriately in your HTML file to enable the Voice-to-Text feature in your application.

## Available Commands

The following voice commands have been added to the application:

1. **"Stop Listening"**
   - *Functionality:* Pauses voice recognition.
   - *How to use:* Say "Stop Listening" during voice recognition.

2. **"Resume Listening"**
   - *Functionality:* Resumes voice recognition.
   - *How to use:* Say "Resume Listening" during a paused state.

3. **"PK"**
   - *Functionality:* Stops listening completely.
   - *How to use:* Say "PK" during any state to stop voice recognition.

## How Commands Work

1. **Stop Listening:**
   - Pauses voice recognition with `annyang.pause();`.
   - The application responds with "Listening paused. Say 'Resume Listening' to continue."

2. **Resume Listening:**
   - Resumes voice recognition with `annyang.resume();`.
   - The application responds with "Listening resumed..."

3. **PK:**
   - Stops listening completely with `annyang.abort();`.
   - Additionally, it processes the voice result, removes certain keywords, and adds the voice entry to the list.

