document.getElementById('submit').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    try {
        const response = await fetch('http://localhost:5000/api/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: username, email: email, phone: phone, password: password })
        });

        if (!response.ok) {
            // If the response is not okay, handle the error
            const errorText = await response.json();
            document.getElementById('form').style.display = 'none';
            document.getElementById('alternative').style.display = 'block';
            document.getElementById('alternative').textContent = errorText.message || 'An error occurred';
            throw new Error(errorText.message || 'An error occurred');
            
        }

        // If the response is okay, parse the response as JSON
        const data = await response.json();
        document.getElementById('form').style.display = 'none';
        document.getElementById('alternative').style.display = 'block';
        document.getElementById('alternative').textContent = "ጥያቄዎን ተቀብለናል፣ በኢሜይል ወይንም በስልክ ምላሽ እስከሚያገኙ ድረስ ይጠብቁ";
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('form').style.display = 'none';
        document.getElementById('alternative').style.display = 'block';
        document.getElementById('alternative').textContent = error.message || "ይቅርታ ጥያቄዎን ማስተናገድ አልተቻለም"; // Optional error message for the user
    }
});
