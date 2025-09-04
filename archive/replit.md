# Overview

This is an interactive escape room challenge web application featuring both a client-side game and a backend leaderboard system. The project creates an immersive puzzle-solving experience with a minimalistic design using light yellow backgrounds. The application includes an engaging FPL Trophy mystery storyline and comprehensive sound effects. Users solve three sequential riddles to "escape" while being timed, and their scores are stored in a PostgreSQL database for admin tracking via a leaderboard interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Single-page application**: Built entirely in vanilla HTML with embedded CSS and JavaScript
- **Responsive design**: Uses CSS flexbox and viewport meta tags for mobile compatibility
- **Visual theme**: Minimalistic design with light yellow background (#fffacd) and clean typography
- **Layout structure**: Centered container design with maximum width constraints for optimal viewing
- **API Integration**: Frontend communicates with backend API for leaderboard functionality

## Backend Architecture
- **Node.js Express Server**: Handles API requests and serves static files
- **PostgreSQL Database**: Stores team completion data and leaderboard information
- **RESTful API**: Endpoints for submitting scores and retrieving leaderboard data
- **Admin Interface**: Separate HTML page for viewing and managing leaderboard

## Styling Strategy
- **CSS-in-HTML approach**: All styles are embedded within the HTML file for simplicity and portability
- **Color scheme**: Minimalistic theme with light yellow background, white containers, and subtle borders
- **Typography**: Courier New monospace font for retro computer terminal appearance
- **Sound integration**: Web Audio API for interactive sound effects (button clicks, correct/incorrect answers, victory fanfare)

## Game Logic Architecture
- **Hybrid architecture**: Client-side game logic with backend score persistence
- **Progressive disclosure**: Implements puzzle progression through JavaScript state management
- **Clean UI**: Simple, professional design with focused user experience
- **Multi-team support**: Backend tracks multiple teams for competitive gameplay

# External Dependencies

## Core Technologies
- **HTML5**: Base markup structure for both game and admin interfaces
- **CSS3**: Styling with flexbox, shadows, and responsive design
- **Vanilla JavaScript**: Game logic and API communication
- **Node.js**: Backend server runtime
- **Express.js**: Web framework for API endpoints
- **PostgreSQL**: Database for persistent leaderboard storage

## Backend Dependencies
- **@neondatabase/serverless**: PostgreSQL connection driver
- **cors**: Cross-origin resource sharing middleware
- **express**: Web application framework

## Browser APIs
- **Web Audio API**: Sound effects for interactive feedback
- **Fetch API**: Communication with backend API endpoints
- **Standard web APIs**: Modern browser support for CSS3 and ES6+ features

## Hosting Requirements
- **Full-stack hosting**: Requires server and database support
- **PostgreSQL database**: Persistent storage for team scores
- **Node.js runtime**: Server-side processing for API endpoints
- **Port 5000**: Default port for the Express server