// Get all DOM elements we'll need
const addClassroomForm = document.getElementById('addClassroomForm');
const roomIdInput = document.getElementById('roomId');
const capacityInput = document.getElementById('capacity');
const floorNoInput = document.getElementById('floorNo');
const classroomsList = document.getElementById('classroomsList');
const addErrorDiv = document.getElementById('addError');
const addSuccessDiv = document.getElementById('addSuccess');
const totalStudentsInput = document.getElementById('totalStudents');
const allocateBtn = document.getElementById('allocateBtn');
const allocationResult = document.getElementById('allocationResult');
const resultContent = document.getElementById('resultContent');
const allocateErrorDiv = document.getElementById('allocateError');

// Store classrooms in browser
let classrooms = [];

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    loadClassrooms();
});

// Load classrooms from backend API
async function loadClassrooms() {
    try {
        const response = await fetch('/api/classrooms');
        classrooms = await response.json();
        displayClassrooms();
    } catch (error) {
        console.error('Error loading classrooms:', error);
        classrooms = [];
    }
}

// Handle adding new classroom
addClassroomForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearMessages();

    // Get form values
    const roomId = roomIdInput.value.trim();
    const capacity = parseInt(capacityInput.value);
    const floorNo = parseInt(floorNoInput.value);

    // Get the radio button value for washroom
    const washroomRadio = document.querySelector('input[name="nearWashroom"]:checked');
    const nearWashroom = washroomRadio ? washroomRadio.value === 'true' : false;

    // Validate room id
    if (!roomId) {
        showError(addErrorDiv, 'Room ID is required');
        return;
    }

    // Create new classroom object
    const newClassroom = {
        roomId,
        capacity,
        floorNo,
        nearWashroom
    };

    try {
        const response = await fetch('/api/classrooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newClassroom)
        });

        const data = await response.json();

        if (!response.ok) {
            showError(addErrorDiv, data.error || 'Failed to add classroom');
            return;
        }

        // Show success message
        showSuccess(addSuccessDiv, `Classroom ${roomId} added successfully!`);

        // Reset form and reload display
        addClassroomForm.reset();
        loadClassrooms();
    } catch (error) {
        showError(addErrorDiv, 'Error adding classroom: ' + error.message);
    }
});

// Display all classrooms
function displayClassrooms() {
    if (classrooms.length === 0) {
        classroomsList.innerHTML = '<p class="empty-state">No classrooms added yet</p>';
        return;
    }

    // Sort by floor first, then by capacity
    const sorted = [...classrooms].sort((a, b) => {
        if (a.floorNo !== b.floorNo) {
            return a.floorNo - b.floorNo;
        }
        return a.capacity - b.capacity;
    });

    // Build HTML for each classroom
    classroomsList.innerHTML = sorted.map(room => `
        <div class="classroom-item">
            <div class="classroom-info">
                <div class="classroom-id">${room.roomId}</div>
                <div class="classroom-details">
                    <span class="classroom-badge">Capacity: ${room.capacity}</span>
                    <span class="classroom-badge">Floor: ${room.floorNo}</span>
                    ${room.nearWashroom ? '<span class="classroom-badge classroom-washroom">Near Washroom</span>' : ''}
                </div>
            </div>
            <button class="btn btn-danger" onclick="removeClassroom('${room.roomId}')">Delete</button>
        </div>
    `).join('');
}

// Delete a classroom
async function removeClassroom(roomId) {
    if (!confirm(`Delete classroom ${roomId}?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/classrooms/${roomId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Failed to delete classroom');
            return;
        }

        loadClassrooms();
    } catch (error) {
        alert('Error deleting classroom: ' + error.message);
    }
}

// Allocate seats to classrooms
allocateBtn.addEventListener('click', async () => {
    clearMessages();

    const totalStudents = parseInt(totalStudentsInput.value);

    // Validate input
    if (!totalStudents || totalStudents <= 0) {
        showError(allocateErrorDiv, 'Please enter a valid number of students');
        return;
    }

    // Check if we have any classrooms
    if (classrooms.length === 0) {
        showError(allocateErrorDiv, 'Add classrooms first');
        return;
    }

    try {
        const response = await fetch('/api/allocate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ totalStudents: totalStudents })
        });

        const result = await response.json();
        displayAllocationResult(result);
    } catch (error) {
        showError(allocateErrorDiv, 'Error allocating seats: ' + error.message);
    }
});

// Main allocation algorithm (kept for reference, now handled by backend)
function allocateExam(totalStudents) {
    // Sort rooms by floor (prefer lower floors) then by capacity
    const availableRooms = [...classrooms].sort((a, b) => {
        if (a.floorNo !== b.floorNo) {
            return a.floorNo - b.floorNo;
        }
        return a.capacity - b.capacity;
    });

    const allocated = [];
    let remainingStudents = totalStudents;

    // Allocate students to rooms
    for (const room of availableRooms) {
        if (remainingStudents <= 0) break;

        const seatsToAllocate = Math.min(room.capacity, remainingStudents);

        allocated.push({
            roomId: room.roomId,
            capacity: room.capacity,
            floorNo: room.floorNo,
            nearWashroom: room.nearWashroom,
            seatsAllocated: seatsToAllocate
        });

        remainingStudents -= seatsToAllocate;
    }

    // Check if all students could be allocated
    if (remainingStudents > 0) {
        return {
            success: false,
            message: 'Not enough seats available',
            shortage: remainingStudents
        };
    }

    return {
        success: true,
        message: `Successfully allocated all ${totalStudents} students`,
        allocated: allocated,
        totalRoomsUsed: allocated.length
    };
}

// Show allocation results
function displayAllocationResult(result) {
    allocationResult.classList.remove('hidden');

    if (!result.success) {
        resultContent.innerHTML = `
            <div class="result-summary error">
                <strong>Allocation Failed</strong><br>
                ${result.message}<br>
                Shortage: ${result.shortage} students
            </div>
        `;
        allocationResult.classList.add('error');
        allocationResult.classList.remove('success');
        return;
    }

    allocationResult.classList.add('success');
    allocationResult.classList.remove('error');

    // Build room allocation details
    const roomsHtml = result.allocated.map(room => `
        <div class="allocation-classroom">
            <div class="allocation-classroom-info">
                <div class="allocation-classroom-id">${room.roomId}</div>
                <div class="allocation-classroom-details">
                    Capacity: ${room.capacity} | Floor: ${room.floorNo}
                    ${room.nearWashroom ? ' | Near Washroom' : ''}
                </div>
            </div>
            <div class="allocation-seats">${room.seatsAllocated} seats</div>
        </div>
    `).join('');

    resultContent.innerHTML = `
        <div class="result-summary success">
            <strong>${result.message}</strong><br>
            Total Rooms Used: ${result.totalRoomsUsed}
        </div>
        ${roomsHtml}
    `;
}

// Helper: Show error message
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

// Helper: Show success message
function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

// Helper: Hide all messages
function clearMessages() {
    addErrorDiv.classList.remove('show');
    addSuccessDiv.classList.remove('show');
    allocateErrorDiv.classList.remove('show');
}
