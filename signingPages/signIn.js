document.getElementById('submit').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const alternativeElement = document.getElementById('alternative');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validate input
    if (!username || !password) {
        console.error('Username and password are required.');
        alternativeElement.textContent = 'Username and password are required.';
        return;
    }

    let url;
    let nextPage;

    // Check if Admin or Student is selected
    if (document.getElementById('admin') && document.getElementById('admin').checked) {
        url = 'http://localhost:5000/api/adminAuth';
        nextPage = '../admin/admin.html';
    } else if (document.getElementById('student') && document.getElementById('student').checked) {
        url = 'http://localhost:5000/api/studentAuth';
        nextPage = '../student/student.html';
    } else {
        console.error('Please select either Admin or Student.');
        alternativeElement.textContent = 'Please select either Admin or Student.';
        return;
    }

    // Send POST request
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, password: password })
    })
    .then(response => {
        console.log('Response received:', response); // Log the response

        // Handle non-successful responses
        if (!response.ok) {
            return response.text().then(errorText => {
                document.getElementById('form').style.display = 'none';
                alternativeElement.style.display = 'block';
                alternativeElement.textContent = errorText;

                console.error(`HTTP error! status: ${response.status}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            });
        }

        // Retrieve the token from the headers
        const token = response.headers.get('x-auth-token');
        console.log('Token received:', token); // Log the received token

        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            console.error('No token provided in the response.');
        }

        return response.json(); // Proceed to parse the response as JSON
    })
    .then(data => {
        console.log('Login successful, data received:', data);

        document.getElementById('form').style.display = 'none';
        alternativeElement.style.display = 'block';
        alternativeElement.textContent = "Login successful!";
        
        // Redirect to the next page
        window.location.href = nextPage;
    })
    .catch(error => {
        console.error('Error during login:', error);
        alternativeElement.textContent = 'An error occurred during login.';
    });
});
