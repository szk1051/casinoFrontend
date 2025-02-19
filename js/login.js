const btnLogin = document.getElementsByClassName('login')[0];
const btnReg = document.getElementById('regBt');

btnLogin.addEventListener('click', login);
btnReg.addEventListener('click',()=>{
    window.location.href = '../register.html';
});
function getAllCookies() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
    }, {});
}

async function login(email, password) {
    try {
        console.log('Making login request...');
        const response = await fetch('https://nodejs311.dszcbaross.edu.hu/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                psw: password
            })
        });

        console.log('Response headers:', response.headers);
        console.log('Response status:', response.status);
        
        // Log the Set-Cookie header
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('Set-Cookie header:', setCookieHeader);

        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
            console.log('Login successful, checking cookies...');
            console.log('Current cookies:', document.cookie);
            console.log('All cookies:', getAllCookies());
            
            // If we received a token in the response, set it manually as a fallback
            if (data.token) {
                document.cookie = `auth_token=${data.token}; path=/; domain=.dszcbaross.edu.hu; secure; samesite=none`;
            }

            // Verify the cookie was set
            const cookies = getAllCookies();
            if (!cookies.auth_token) {
                console.warn('Cookie not set automatically, manual setup required');
            }

            return data;
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

function resetInputs() {
    document.getElementById('email').value = null;
    document.getElementById('psw').value = null;
}
