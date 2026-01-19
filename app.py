from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

DATA_FILE = 'classrooms.json'

def load_classrooms():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_classrooms(classrooms):
    with open(DATA_FILE, 'w') as f:
        json.dump(classrooms, f, indent=2)

def allocate_exam(total_students, classrooms):
    if not classrooms:
        return {
            'success': False,
            'message': 'Not enough seats available',
            'allocated': []
        }
    
    # sort by floor first, then capacity
    sorted_classrooms = sorted(classrooms, key=lambda x: (x['floorNo'], x['capacity']))
    
    allocated = []
    remaining = total_students
    
    for room in sorted_classrooms:
        if remaining <= 0:
            break
        
        seats = min(room['capacity'], remaining)
        allocated.append({
            'roomId': room['roomId'],
            'capacity': room['capacity'],
            'floorNo': room['floorNo'],
            'nearWashroom': room['nearWashroom'],
            'seatsAllocated': seats
        })
        remaining -= seats
    
    if remaining > 0:
        return {
            'success': False,
            'message': 'Not enough seats available',
            'allocated': [],
            'shortage': remaining
        }
    
    return {
        'success': True,
        'message': f'Successfully allocated {total_students} students in {len(allocated)} classroom(s)',
        'allocated': allocated,
        'totalRoomsUsed': len(allocated)
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/classrooms', methods=['GET'])
def get_classrooms():
    classrooms = load_classrooms()
    return jsonify(classrooms)

@app.route('/api/classrooms', methods=['POST'])
def add_classroom():
    try:
        data = request.get_json()
        
        if not data.get('roomId') or not data.get('capacity') or data.get('floorNo') is None:
            return jsonify({'error': 'Missing required fields'}), 400
        
        capacity = int(data['capacity'])
        floor_no = int(data['floorNo'])
        
        if capacity <= 0:
            return jsonify({'error': 'Capacity must be greater than 0'}), 400
        
        if floor_no < 0:
            return jsonify({'error': 'Floor number cannot be negative'}), 400
        
        classrooms = load_classrooms()
        
        # check duplicate
        if any(c['roomId'] == data['roomId'] for c in classrooms):
            return jsonify({'error': 'Room ID already exists'}), 400
        
        new_classroom = {
            'roomId': data['roomId'],
            'capacity': capacity,
            'floorNo': floor_no,
            'nearWashroom': data.get('nearWashroom', False)
        }
        
        classrooms.append(new_classroom)
        save_classrooms(classrooms)
        
        return jsonify({'success': True, 'classroom': new_classroom}), 201
    
    except ValueError:
        return jsonify({'error': 'Invalid input types'}), 400

@app.route('/api/allocate', methods=['POST'])
def allocate():
    try:
        data = request.get_json()
        total_students = int(data.get('totalStudents', 0))
        
        if total_students <= 0:
            return jsonify({'error': 'Total students must be greater than 0'}), 400
        
        classrooms = load_classrooms()
        result = allocate_exam(total_students, classrooms)
        
        return jsonify(result)
    
    except ValueError:
        return jsonify({'error': 'Invalid total students value'}), 400

@app.route('/api/classrooms/<room_id>', methods=['DELETE'])
def delete_classroom(room_id):
    classrooms = load_classrooms()
    classrooms = [c for c in classrooms if c['roomId'] != room_id]
    save_classrooms(classrooms)
    return jsonify({'success': True, 'message': 'Classroom deleted'})

if __name__ == '__main__':
    app.run(debug=True)