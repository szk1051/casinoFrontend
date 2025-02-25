//script.js
// Create a script.js file and include it in your HTML
document.addEventListener('DOMContentLoaded', () => {
    const balanceDisplay = document.querySelector('.betButtons p');
    let isAdmin = false; // Add flag for admin status

        // Get token more reliably
        function getAuthToken() {
            const cookies = document.cookie.split('; ');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'auth_token') {
                    return value;
                }
            }
            return null;
        }
        
        const authToken = getAuthToken();
        console.log('Auth token found:', authToken);
    
        if (!authToken) {
            // window.location.href = '/login.html';
            return;  // Don't connect if no token
        }

    async function checkAdminStatus() {
        try {
            const response = await fetch('/api/user/role', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user role');
            }
            
            const data = await response.json();
            isAdmin = data.role === 'ADMIN';
            console.log('Admin status:', isAdmin);
        } catch (error) {
            console.error('Error checking admin status:', error);
        }
    }

    // Call this when page loads
    checkAdminStatus();

    async function updateBalance() {
        try {
            const response = await fetch('/api/balance', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to fetch balance');
            }
            
            const data = await response.json();
            balanceDisplay.textContent = `Balance: ${data.balance.toLocaleString()} coins`;
        } catch (error) {
            console.error('Error fetching balance:', error);
            balanceDisplay.textContent = 'Balance: Error loading';
        }
    }
    function updateBalanceDisplay(balance) {
        balanceDisplay.textContent = `Balance: ${balance.toLocaleString()} coins`;
    }
    
    // Update balance immediately when page loads
    updateBalance();
    
    // Optional: Update balance periodically (every 30 seconds)
    setInterval(updateBalance, 30000);
    
    // Export function for use in other parts of your code
    window.updateBalance = updateBalance;

    // Debug cookie
    console.log('Full cookie:', document.cookie);
    


    const socket = io('https://extraordinary-parfait-60b553.netlify.app', {
    withCredentials: true,
    auth: {
        token: authToken
    }
});

    socket.on('connect', () => {
        console.log('Connected to socket server');
        socket.emit('request_game_state');
    });

    socket.on('balance_update', (data) => {
        console.log('Balance update received:', data);
        updateBalanceDisplay(data.balance);
    });







    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });


    window.dispatchEvent(new CustomEvent('socketReady', { detail: socket }));

    const chatbox = document.querySelector('.chatboxRow');
    const scroll = document.querySelector('.chatbox');
    const messageInput = document.getElementById('messageInput');
    
    // Debug logs to verify elements are found
    console.log('Found chatbox:', chatbox);
    console.log('Found messageInput:', messageInput);

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            // console.log('Key pressed:', e.key);  // Debug log
            if (e.key === 'Enter' && messageInput.value.trim()) {
                // console.log('Sending message:', messageInput.value);  // Debug log
                socket.emit('send_message', { message: messageInput.value });
                messageInput.value = '';
            }
        });
    } else {
        console.error('Message input element not found!');
    }

    function isCommand(message) {
        return message.startsWith('/');
    }

    // Function to create a message element
    function createMessageElement(messageData) {
        // Don't create element for command messages
        if (isCommand(messageData.message)) {
            return null;
        }        

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        const colImgDiv = document.createElement('div');
        colImgDiv.className = 'col-2 mt-3';
        const profilePicDiv = document.createElement('div');
        profilePicDiv.className = 'profile-pic mx-auto';
       
        const chatboxImg = document.createElement('img');
        //chatboxImg.className = ''
        chatboxImg.src = `http://34.78.10.229:3000/uploads/${messageData.profile_pic}`; //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        chatboxImg.alt = 'Profile Picture';
        // Add error handling for images
        chatboxImg.onerror = function() {
            console.error(`Failed to load image for user: ${messageData.username}`);
            // Optionally set a default image
            this.src = 'path/to/default-profile-pic.png';
        };

        colImgDiv.appendChild(profilePicDiv);
        profilePicDiv.appendChild(chatboxImg);

        // Modify username display based on admin status
        const usernameText = isAdmin ? 
            `${messageData.username} (${messageData.user_id}):` : 
            `${messageData.username}:`;

        messageDiv.innerHTML = `
            <div class="col-10 mt-3">
              <div id="chatUsername" class="">${usernameText}</div>
              <div id="chatMessage" class="ms-2 d-flex justify-content-start">${messageData.message}</div>
            </div>
        `;
        
        messageDiv.insertBefore(colImgDiv, messageDiv.firstChild);
        return messageDiv;
    }

    // Load initial messages
    socket.on('load_messages', (messages) => {
        chatbox.innerHTML = ''; // Clear existing messages
        messages.forEach(message => {
            const messageElement = createMessageElement(message);
            if (messageElement) { // Only append if not a command
                chatbox.appendChild(messageElement);
            }
        });
        scroll.scrollTop = chatbox.scrollHeight;
    });

    // Handle new messages
    socket.on('new_message', (message) => {
        const messageElement = createMessageElement(message);
        if (messageElement) { // Only append if not a command
            chatbox.appendChild(messageElement);
            scroll.scrollTop = chatbox.scrollHeight;
        }
    });

    // Handle command responses
    socket.on('commandResponse', (response) => {
        console.log('Command response:', response.message);        
        // Optionally show a temporary notification or toast
        // You could add a small notification system here if you want admins
        // to see command confirmations
    });
    socket.on('error', (error) => {
        console.error('Server error:', error.message);
        // Optionally show error to user
        // You could add a small notification system here
    });

    // Handle sending messages
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && messageInput.value.trim()) {
            const message = messageInput.value.trim();
            console.log('Sending message:', message);
           
            // Send the message regardless of whether it's a command
            socket.emit('send_message', { message: message });
           
            // Clear input
            messageInput.value = '';
           
            // If it's a command, don't worry about displaying it
            // The createMessageElement function will handle hiding it
        }
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        // You might want to show an error message to the user
    });
});