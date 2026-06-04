# Orbitrip – AI Powered Travel Planning Platform

## Overview

Orbitrip is a modern travel planning platform designed to simplify multi-city trip organization through intelligent planning, budgeting, collaboration, and itinerary visualization.

Built for the Odoo Hackathon, Orbitrip transforms traditional travel planning into an interactive and personalized experience where users can:

* Create multi-city itineraries
* Discover destinations and activities
* Estimate and optimize budgets
* Collaborate with friends
* Share public travel plans
* Generate AI-powered travel recommendations

The platform combines intuitive UI/UX with AI-assisted planning to make travel preparation as exciting as the journey itself.

---

# Problem Statement

Traditional travel planning is fragmented and time-consuming. Users often rely on multiple platforms for:

* itinerary planning,
* budget tracking,
* activity discovery,
* note management,
* and collaboration.

Orbitrip solves this by providing a unified platform for end-to-end trip planning with intelligent assistance and real-time organization.

The project is based on the personalized travel planning challenge provided in the hackathon problem statement. 

---

# Key Features

## Authentication

* Secure Login & Signup
* Session management
* User profile settings

## Smart Dashboard

* Upcoming trips
* Budget summaries
* Personalized recommendations
* Recent activity overview

## AI Trip Generator

Generate complete itineraries using:

* destination preferences
* budget
* travel duration
* interests
* travel style

Example:

> “Plan a 7-day Japan trip under ₹1,00,000 focused on food and anime.”

---

## Multi-City Itinerary Builder

* Add multiple destinations
* Drag-and-drop city ordering
* Timeline visualization
* Day-wise planning

---

## Activity Discovery

* Search cities and attractions
* Filter by:

  * cost
  * duration
  * category
  * popularity

---

## Budget Intelligence

* Estimated total trip cost
* Daily spending analytics
* Expense breakdowns
* Over-budget alerts
* Interactive charts

---

## Collaboration

* Shared trip planning
* Public itinerary pages
* Collaborative editing
* Trip inspiration sharing

---

## Packing Checklist

* Personalized packing lists
* Categorized items
* Reusable templates

---

## Notes & Travel Journal

* Day-wise travel notes
* Important reminders
* Hotel and contact details

---

# Tech Stack

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

## Backend

* Node.js
* Prisma ORM
* PostgreSQL / Supabase

## AI & APIs

* OpenAI API
* Gemini API
* Mapbox API

## Deployment

* Vercel

---

# System Architecture

```bash
Client (Next.js Frontend)
        ↓
REST API Layer
        ↓
Prisma ORM
        ↓
PostgreSQL Database
        ↓
AI Services + External APIs
```

---

# Folder Structure

```bash
Orbitrip/
│
├── app/
│   ├── dashboard/
│   ├── trips/
│   ├── auth/
│   ├── profile/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── itinerary/
│   ├── budget/
│   └── shared/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── styles/
│
└── README.md
```

---

# Database Models

## User

* id
* name
* email
* password
* avatar

## Trip

* id
* title
* description
* startDate
* endDate
* budget
* visibility

## CityStop

* id
* cityName
* country
* arrivalDate
* departureDate

## Activity

* id
* title
* category
* cost
* duration

## Expense

* id
* type
* amount
* date

## ChecklistItem

* id
* itemName
* packedStatus

## Notes

* id
* content
* timestamp

---

# UI/UX Highlights

* Glassmorphism-inspired interface
* Smooth micro-interactions
* Responsive mobile-first design
* Animated itinerary timeline
* Interactive dashboard widgets
* Dark/Light mode support

---

# AI Features

## AI Itinerary Planner

Generates:

* routes
* city suggestions
* activities
* optimized schedules

## Smart Budget Estimator

Predicts:

* accommodation costs
* food expenses
* transport spending
* activity expenses

## Personalized Recommendations

Suggests:

* attractions
* restaurants
* hidden gems
* experiences

---

# Future Scope

* Real-time flight integration
* Hotel booking APIs
* Weather forecasting
* Expense splitting
* Offline trip access
* Voice-based planning assistant

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/Orbitrip.git
cd Orbitrip
```

---

## Install Dependencies

```bash
npm install
```

---

## Setup Environment Variables

Create `.env` file:

```env
DATABASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_MAPBOX_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

---

## Run Development Server

```bash
npm run dev
```

---

# Deployment

## Recommended Platform

* Vercel

## Deployment Steps

1. Push project to GitHub
2. Import repository into Vercel
3. Configure environment variables
4. Deploy

---

# Demo Flow

1. User signs in
2. Creates a new trip
3. Uses AI trip generator
4. Builds itinerary
5. Adds activities
6. Reviews budget dashboard
7. Shares public trip page
8. Collaborates with friends

---

# Hackathon Differentiators

* AI-assisted planning
* Collaborative itinerary building
* Premium product-level UI
* Smart budgeting system
* Timeline-based travel visualization
* Public travel sharing ecosystem

---

# Team Vision

Orbitrip aims to make travel planning:

* intelligent,
* collaborative,
* organized,
* and enjoyable.

Instead of juggling spreadsheets, maps, and notes across multiple platforms, users can manage their complete journey within one seamless experience.

---

# Contributors

Team Orbitrip
Built for the Odoo Hackathon

---

# License

This project is intended for educational and hackathon purposes.
