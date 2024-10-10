const token = localStorage.getItem('authToken');
if (!token) {
    window.location.href = '../signIn.html';
}
const profile = document.getElementById('profile');
const studentList = document.getElementById('studentList');
const mainElement = document.querySelector('main');

console.log(token);

// Fetch admin data
fetch('http://localhost:5000/api/admins/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    profile.textContent = `${data.name} - ${data.email}`;
})
.catch(error => {
    console.error('Error fetching admin profile:', error);
    alert('Failed to load profile data.');
});






// Get students
function fetchStudents() {
    fetch('http://localhost:5000/api/admins/students', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorText => {  // Wait for the promise to resolve
                throw new Error(errorText.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayStudents(data);
    })
    .catch(error => {
        console.error(error.message);
        alert(`${error.message}`);
    });
}
function fetchLevels(){
    fetch('http://localhost:5000/api/admins/levels', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            if (!response.ok) {
                return response.json().then(errorText => {  // Wait for the promise to resolve
                    throw new Error(errorText.message);
                });
            }
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayLevels(data);
    })
    .catch(error => {
        console.error('Error fetching levels:', error);
        alert(`${error.message}`);
    });
}

// Display students in a table
function displayStudents(students) {
    mainElement.innerHTML = '<h1 style="text-align: center; font-size: 2rem;">Students List</h1>';
    
    // Create table with styles
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '20px 0';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Student Name', 'Email', 'Phone', 'ID', 'Current Level', 'Current Department'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #dddddd';
        th.style.textAlign = 'left';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2'; // Header background color
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    students.forEach(student => {
        const row = document.createElement('tr');
        row.style.border = '1px solid #dddddd';
        
        row.innerHTML = `
            <td style="border: 1px solid #dddddd; padding: 8px;">${student.name}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${student.email}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${student.phone}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${student._id}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${student.currentLevel ? student.currentLevel.name : 'none'}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${student.currentDepartment ? student.currentDepartment.name : 'none'}</td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    mainElement.appendChild(table);
}
function displayLevels(levelsArray){
    mainElement.innerHTML = '<h1 style="text-align: center; font-size: 2rem;">Levels List</h1>';
    levelsArray.forEach(level => {
        displayAnObject(level);
        mainElement.innerHTML += '<br style="height:;, border: 1px solid #dddddd" />';
    })
}
function displayApplications(applicationArray) {
    mainElement.innerHTML = '<h1 style="text-align: center; font-size: 2rem;">Applications list</h1>';
    
    // Create table with styles
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '20px 0';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Student Name', 'Email', 'Phone', 'ID', '', ''];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        th.style.border = '1px solid #dddddd';
        th.style.textAlign = 'left';
        th.style.padding = '8px';
        th.style.backgroundColor = '#f2f2f2'; // Header background color
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    applicationArray.forEach(application => {
        const row = document.createElement('tr');
        row.style.border = '1px solid #dddddd';
        
        row.innerHTML = `
            <td style="border: 1px solid #dddddd; padding: 8px;">${application.name}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${application.email}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${application.phone}</td>
            <td style="border: 1px solid #dddddd; padding: 8px;">${application._id}</td>
            <td><button class="add" value="${application._id}" style="padding: 5px 10px; border: none; border-radius: 4px; background-color: #4CAF50; color: white; cursor: pointer;">Add</button></td>
            <td><button class="reject" value="${application._id}" style="padding: 5px 10px; border: none; border-radius: 4px; background-color: #f44336; color: white; cursor: pointer;">Reject</button></td>
        `;
    
        // Add event listeners for the buttons
        row.querySelector('.add').addEventListener('click', () => {
            addStudent(application._id);
            row.querySelector('.add').style.display = 'none'; // Hide the Add button
            row.querySelector('.reject').style.display = 'none'; // Hide the Reject button
        });

        row.querySelector('.reject').addEventListener('click', () => {
            rejectApplication(application._id);
            row.querySelector('.add').style.display = 'none'; // Hide the Add button
            row.querySelector('.reject').style.display = 'none'; // Hide the Reject button
        });

        tbody.appendChild(row);
    });    
    table.appendChild(tbody);
    mainElement.appendChild(table);
}

function addStudent(applicationId) {
    fetch(`http://localhost:5000/api/registration/${applicationId}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            if (!response.ok) {
                return response.json().then(errorText => {  // Wait for the promise to resolve
                    throw new Error(errorText.message);
                });
            }
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert("Student added successfully");
    })
    .catch(error => {
        console.error('Error adding student:', error);
        alert(`${error.message}`);
    });
}
function rejectApplication(applicationId) {
    fetch(`http://localhost:5000/api/registration/${applicationId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert("Student rejected successfully");
    })
    .catch(error => {
        console.error('Error rejecting student:', error);
        alert(`Error rejecting student: ${error.message}`);
    });
}
// Get a student by ID
// Get a student by ID
function fetchAStudent(studentId) {
    // Trim any whitespace
    studentId = studentId.trim();

    if (!studentId) {
        alert("Please enter a valid student ID.");
        return;
    }

    fetch(`http://localhost:5000/api/admins/students/${studentId}/moreDetail`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorText => {  // Wait for the promise to resolve)
                throw new Error(errorText.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayStudentDetails(data);
    })
    .catch(error => {
        console.error('Error fetching student details:', error);
        alert(`${error.message}`);
    });
}
function fetchAdepartment(departmentName) {
    // Trim any whitespace
    departmentName = departmentName.trim();

    if (!departmentName) {
        alert("Please enter a valid department name.");
        return;
    }

    fetch(`http://localhost:5000/api/admins/departments/${departmentName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
    })
    .then(response => {
        if (!response.ok) {
            if (!response.ok) {
                return response.json().then(errorText => {  // Wait for the promise to resolve
                    throw new Error(errorText.message);
                });
            }
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayDepartmentDetails(data);
    })
    .catch(error => {
        console.error('Error fetching student details:', error);
        alert(`${error.message}`);
    });
}
function fetchAlevel(levelId) {
    // Trim any whitespace
    levelId = levelId.trim();

    if (!levelId) {
        alert("Please enter a valid level ID.");
        return;
    }

    fetch(`http://localhost:5000/api/admins/levels/${levelId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
    })
    .then(response => {
        console.log(`Fetching level with ID: ${levelId}`);
        if (!response.ok) {
            console.log(response);
            if (!response.ok) {
                return response.json().then(errorText => {  // Wait for the promise to resolve
                    throw new Error(errorText.message);
                });
            }
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched level data:', data);
        displayLevelDetails(data);
    })
    .catch(error => {
        console.error('Error fetching level details:', error);
        alert(`${error.message}`);
    });
}





// Display student details
function displayStudentDetails(data) {
    mainElement.innerHTML = `
        <h1 style="text-align: center; font-size: 2rem;">Student Details</h1>
    `;
    displayAnObject(data)
    // Loop through the object keys
    
}
function displayDepartmentDetails(data) {
    mainElement.innerHTML = `<h1 style="text-align: center; font-size: 2rem;">Department Details</h1>`;
    displayAnObject(data);
}
function displayLevelDetails(data) {
    mainElement.innerHTML = `<h1 style="text-align: center; font-size: 2rem;">Level Details</h1>`;
    displayAnObject(data);
}






function displayAnObject(obj, level = 0) {
    // Set color variables for top-level and nested elements
    const topLevelColor = '#3498DB'; // Blue color for top-level keys
    const nestedColor = '#27AE60';   // Green color for nested elements
    const textColor = level === 0 ? topLevelColor : nestedColor; // Determine the color based on the level

    Object.keys(obj).forEach(key => {
        let value = obj[key];

        // Handle arrays
        if (Array.isArray(value)) {
            mainElement.innerHTML += `
                <div style="margin-left: ${level * 20}px; font-weight: bold; color: ${textColor};">${key}:</div>
                <ul style="margin-left: ${(level + 1) * 20}px; color: ${textColor};">
                    ${value.map(item => `<li>${typeof item === 'object' ? JSON.stringify(item, null, 2) : item}</li>`).join('')}
                </ul>
            `;
        } 
        // Handle nested objects
        else if (typeof value === 'object' && value !== null) {
            mainElement.innerHTML += `
                <div style="margin-left: ${level * 20}px; font-weight: bold; color: ${textColor};">${key}:</div>
                <div style="margin-left: ${(level + 1) * 20}px; border-left: 2px solid #BDC3C7; padding-left: 10px;">
            `;
            displayAnObject(value, level + 1); // Recursively call for nested objects
            mainElement.innerHTML += `</div>`;
        } 
        // Handle primitive types
        else {
            mainElement.innerHTML += `
                <p style="margin-left: ${level * 20}px; color: ${textColor};">
                    <strong>${key}</strong>: ${value}
                </p>`;
        }
    });
}







// Event listeners for buttons
document.getElementById('getStudents').addEventListener('click', (event) => {
    event.preventDefault();
    fetchStudents();
});
document.getElementById('getLevels').addEventListener('click', (event) => {
    event.preventDefault();
    fetchLevels();
})

document.getElementById('getAstudent').addEventListener('click', (event) => {
    event.preventDefault();
    const studentId = prompt("Enter student ID:");
    fetchAStudent(studentId);
});
document.getElementById('getDepartments').addEventListener('click', (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/api/admins/departments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorText => {  // Wait for the promise to resolve
                throw new Error(errorText.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayAnObject(data);
    })
    .catch(error => {
        console.error('Error fetching departments:', error);
        alert(`${error.message}`);
    });
})
document.getElementById('getAdepartment').addEventListener('click', (event) => {
    event.preventDefault();
    const departmentName = prompt("Enter department Name:");
    fetchAdepartment(departmentName);
});

document.getElementById('getAlevel').addEventListener('click', (event) => {
    event.preventDefault();
    const levelId = prompt("Enter level ID:");
    fetchAlevel(levelId);
});
document.getElementById('addLevel').addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href='addLevel.html';
})
document.getElementById('addStudent').addEventListener('click', (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/api/registration/', {
        method:'GET',
        headers:{
            'content-type':'application/json',
            'x-auth-token':token
        }
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(errorText => {
                throw new Error(errorText.message);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        displayApplications(data);
    })
    .catch(error => {
        console.error('Error fetching level details:', error);
        alert(`${error.message}`);
    });
});
document.getElementById('removeStudent').addEventListener('click', (event)=> {
    event.preventDefault();
    
    // Inject the form with added styles into the main element
    mainElement.innerHTML = `
    <style>
        .removal-form-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        .removal-form-container h1 {
            font-size: 24px;
            text-align: center;
            color: #333;
            margin-bottom: 20px;
        }
        .removal-form-container label {
            font-size: 16px;
            color: #555;
            display: block;
            margin-bottom: 8px;
        }
        .removal-form-container input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }
        .removal-form-container input[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .removal-form-container input[type="submit"]:hover {
            background-color: #0056b3;
        }
        .removal-form-container input[type="submit"]:active {
            background-color: #004085;
        }
    </style>

    <div class="removal-form-container">
        <h1>Remove Student</h1>
        <form id="removingStudentsForm">
            <label for="studentId">Enter the student's ID:</label>
            <input type="text" id="studentId" minlength="24" maxlength="24" required>
            <label for="reason">Reason for removing the student:</label>
            <input type="text" id="reason" minlength="15" required>
            <input type="submit" value="Remove Student">
        </form>
    </div>`;

    // Add event listener for form submission
    document.getElementById('removingStudentsForm').addEventListener('submit', (event) => {
        event.preventDefault();  // Prevent form submission from refreshing the page

        let studentId = document.getElementById('studentId').value;
        let reason = document.getElementById('reason').value;
        
        fetch(`http://localhost:5000/api/admins/students/${studentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token  // Ensure token is defined somewhere
            },
            body: JSON.stringify({
                reason: reason  // Only send the reason in the body
            })
        })
        .then(response => {
            if (!response.ok) {
                const errorText = response.json();
                throw new Error(errorText.message);
            }
            return response.json();
        })
        .then(data => { 
            console.log(data);
            document.getElementById('removingStudentsForm').innerHTML=`<p>${data.message}</p>`;  // Update the UI with the remaining students
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('removingStudentsForm').innerHTML=`<p>${error.message}</p>`
              // Log any error that occurs
        });
    });
});
document.getElementById('addDepartment').addEventListener('click', (event)=> {
    event.preventDefault();
    mainElement.innerHTML = `
    <style>
      /* Main container */
      form {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 20px;
      }

      label {
        font-size: 16px;
        color: #555;
        margin-bottom: 8px;
        display: block;
      }

      input[type="text"] {
        padding: 10px;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 20px;
        font-size: 14px;
        box-sizing: border-box;
      }

      input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 10px;
        width: 100%;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      input[type="submit"]:hover {
        background-color: #45a049;
      }

      /* Form container */
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    </style>
    <h1>Add Department</h1>
    <form id="addDepartmentForm">
        <label for="departmentName">Department Name:</label>
        <input type="text" id="departmentName" required>
        <input type="submit" value="Add Department">
    </form>`;
    
    document.getElementById('addDepartmentForm').addEventListener('submit', (event) => {
        event.preventDefault();
        fetch('http://localhost:5000/api/admins/departments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                departmentName: document.getElementById('departmentName').value
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorText => {
                    throw new Error(errorText.message);
                });
            }
            return response.json();
        })
        .then(data => {
            mainElement.innerHTML = `<p>successfully added department</p>
            ${displayAnObject(data)}`;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('addDepartmentForm').innerHTML = `<p>${error.message}</p>`;
        });
    });
});
document.getElementById('removeDepartment').addEventListener('click', (event)=> {
    event.preventDefault();
    const departmentName=prompt("enter department name");
    fetch(`http://localhost:5000/api/admins/departments/${departmentName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorText => {
                throw new Error(errorText.message);
            });
        }
        return response.json();
    })
    .then(data => {
        mainElement.innerHTML = `<p>${data.message}</p>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`${error.message}`);
    });
})
document.getElementById('addLesson').addEventListener('click', (event)=> {
    event.preventDefault();
    window.location.href='addLesson.html';
})