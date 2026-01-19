# College Exam Seat Planner

A web-based application to manage and allocate exam seating arrangements for college classrooms.

## Features

- **Add Classroom**: Register classrooms with Room ID, Capacity, Floor Number, and Washroom Proximity
- **View All Classrooms**: Display all classrooms with delete functionality
- **Allocate Exam Seats**: Intelligently allocate students to classrooms using a greedy algorithm
- **Data Persistence**: All data stored in browser's localStorage

## Project Structure

```
├── templates/index.html    # Main UI
├── static/style.css        # Styling
├── static/script.js        # Logic & allocation algorithm
└── README.md
```

## How to Use

1. **Open** `templates/index.html` in your browser
2. **Add Classrooms** with details (Room ID, Capacity, Floor, Washroom proximity)
3. **View** all added classrooms in the list
4. **Allocate** students by entering total count and clicking the allocation button

## Allocation Algorithm

Greedy approach that:

1. Sorts by floor number (ascending) - prefers lower floors
2. Sorts by capacity (ascending) - uses smaller rooms first
3. Allocates minimum rooms needed

**Example:** 100 students with rooms [25/Fl1, 40/Fl1, 20/Fl2] = 3 rooms assigned

## Technology Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Storage: Browser localStorage
- Design: Dark theme with responsive layout

## Setup

Simply open `templates/index.html` in any modern browser - no installation required.

## Browser Support

Chrome, Firefox, Safari, Edge (latest versions)
