const btnLogin = document.getElementsByClassName('login')[0];
const btnReg = document.getElementById('regBt');

btnLogin.addEventListener('click', login);
btnReg.addEventListener('click',()=>{
    window.location.href = '../register.html';
});

async function login(email, password) {
    try {
        const email = document.getElementById('email').value;
        const psw = document.getElementById('psw').value;
        
        console.log('Making login request...');
        const res = await fetch('https://nodejs311.dszcbaross.edu.hu/api/login', {
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
        
        console.log('Response headers:', res.headers);
        console.log('Response status:', res.status);
        
        // Check for Set-Cookie header
        console.log('Set-Cookie header:', res.headers.get('set-cookie'));

        const data = await res.json();
        
        console.log('Response data:', data);

        if (res.ok) {
            console.log('Login successful, checking cookies...');
            console.log('Current cookies:', document.cookie);
            console.log('All cookies:', document.cookie);

            // Test authentication
            try {
                const checkAuth = await fetch('https://nodejs311.dszcbaross.edu.hu/api/check-auth', {
                    credentials: 'include'
                });
                const authData = await checkAuth.json();
                console.log('Auth check:', authData);
            } catch (error) {
                console.error('Auth check failed:', error);
            }
            
            resetInputs();
            showAlert(`${data.message}`,'success');
            setTimeout(() => {
                window.location.href = '../main.html';
            }, 1500);       
        } else if (data.errors) {
            data.errors.forEach(error => {
                showAlert(error.error, 'error');
            });
        } else if (data.error) {
            showAlert(`${data.error}`,'error');
        } else {
            showAlert('Ismeretlen hiba','error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Hiba történt a bejelentkezés során','error');
    }
}

function resetInputs() {
    document.getElementById('email').value = null;
    document.getElementById('psw').value = null;
}
