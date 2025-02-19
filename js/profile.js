document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveBt');
    const usernameInput = document.getElementById('usernameChange');
    const emailInput = document.getElementById('emailChange');
    const passwordInput = document.getElementById('pswChange');
    const profilePic = document.querySelector('.profile-pic');
    let selectedFile = null; // Store the selected file

    // Load current profile picture
    async function loadCurrentProfilePic() {
        try {
            const response = await fetch('https://nodejs311.dszcbaross.edu.hu/api/user/profilePic', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const userData = await response.json();
                profilePic.src = `https://nodejs311.dszcbaross.edu.hu/uploads/${userData.profile_pic}`;
            }
        } catch (error) {
            console.error('Error loading profile picture:', error);
        }
    }

    // Load current profile picture when page loads
    loadCurrentProfilePic();

    // Update profile information
    saveButton.addEventListener('click', async function() {
        try {
            // Username update
            if (usernameInput.value.trim()) {
                const usernameResponse = await fetch('https://nodejs311.dszcbaross.edu.hu/api/editUsername', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username: usernameInput.value.trim() })
                });

                if (!usernameResponse.ok) {
                    const error = await usernameResponse.json();
                    showAlert(`${error.error || 'Failed to update username'}`,'error');
                    return;
                }
            }

            // Email update
            if (emailInput.value.trim()) {
                const emailResponse = await fetch('https://nodejs311.dszcbaross.edu.hu/api/editEmail', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email: emailInput.value.trim() })
                });

                if (!emailResponse.ok) {
                    const error = await emailResponse.json();
                    showAlert(`${error.error || 'Failed to update email'}`,'error');
                    return;
                }
            }

            // Password update
            if (passwordInput.value.trim()) {
                const passwordResponse = await fetch('https://nodejs311.dszcbaross.edu.hu/api/editProfilePsw', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ psw: passwordInput.value.trim() })
                });

                if (!passwordResponse.ok) {
                    const error = await passwordResponse.json();
                    showAlert(`${error.error || 'Failed to update password'}`,'error');
                    return;
                }
            }

            // Profile picture update
            if (selectedFile) {
                const formData = new FormData();
                formData.append('profile_pic', selectedFile);

                const picResponse = await fetch('https://nodejs311.dszcbaross.edu.hu/api/editProfilePic', {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                });

                if (!picResponse.ok) {
                    const error = await picResponse.json();
                    showAlert(`${error.error || 'Failed to update profile picture'}`,'error');
                    return;
                }
                
                profilePic.src = URL.createObjectURL(selectedFile);
                selectedFile = null;
            }

            showAlert('Profile updated successfully!','success');
            usernameInput.value = '';
            emailInput.value = '';
            passwordInput.value = '';

        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('An error occurred while updating profile','error');
        }
    });

    const picUploadButton = document.createElement('button');
    picUploadButton.textContent = 'Choose Profile Picture';
    picUploadButton.className = 'mt-3 uploadBt';
    profilePic.parentElement.appendChild(picUploadButton);

    picUploadButton.onclick = function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                selectedFile = file;
                profilePic.src = URL.createObjectURL(file);
            }
        };
    };
});