# College Exam Seat Planner

A web-based full-stack application designed to efficiently manage and allocate exam seating arrangements for college classrooms using an optimized allocation algorithm.

This system reduces manual effort, minimizes errors, and ensures effective utilization of classroom resources during examinations.

---

## Features

- Add classroom details including:
  - Room ID
  - Seating capacity
  - Floor number
  - Washroom proximity
- View and manage all registered classrooms
- Automatically allocate exam seating for students
- Optimized greedy algorithm to minimize the number of classrooms used
- Persistent data storage using JSON
- Clean and responsive user interface

---

## Allocation Algorithm

The seat allocation uses a greedy strategy:

1. Classrooms are sorted by floor number in ascending order
2. Classrooms are then sorted by seating capacity in ascending order
3. Students are allocated using the minimum number of classrooms required

Example:

For 100 students and classrooms with capacities:
- 25 seats (Floor 1)
- 40 seats (Floor 1)
- 20 seats (Floor 2)

The system allocates 3 classrooms.

---

## Project Structure


```
College-Exam-Seat-Planner/
├── app.py # Flask backend
├── classrooms.json # Classroom data storage
├── requirements.txt # Python dependencies
├── runtime.txt # Python runtime version
├── Procfile # Deployment configuration
├── templates/
│ └── index.html # Main UI
├── static/
│ ├── style.css # Styling
│ └── script.js # Frontend logic
├── .gitignore
└── README.md
```

## Technology Stack

Frontend:
- HTML5
- CSS3
- JavaScript

Backend:
- Python
- Flask

Data Storage:
- JSON-based file storage

---

## How to Run Locally

1. Clone the repository:
git clone https://github.com/Vishakha-Arya/College-Exam-Seat-Planner.git
cd College-Exam-Seat-Planner

2. Create and activate a virtual environment:
python -m venv .venv
.venv\Scripts\activate # Windows
source .venv/bin/activate # macOS/Linux

3. Install dependencies:
pip install -r requirements.txt

4. Run the application:

python app.py

5. Open the application in a browser:
6. 
http://127.0.0.1:5000


## Deployment

This project is configured for deployment on platforms such as:
- Render
- Railway
- Heroku-style services

Required deployment files are already included in the repository.

---

## Use Cases

- College and university examination planning
- Classroom resource optimization
- Academic administration tools
- Educational project demonstrations

---

## Author

Vishakha Arya  

---

## Future Enhancements

- Student-wise seat allocation
- Export seating plans as PDF
- Admin authentication and authorization
- Database integration (MySQL or MongoDB)

---

## License

This project is intended for educational use.
