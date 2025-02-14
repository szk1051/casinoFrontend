const alerts = [];
    const ALERT_HEIGHT = 70; // Height of alert + margin
        
    function showAlert(message, type) {
            // Create new alert
            const alert = document.createElement('div');
            alert.className = `alert ${type}`;
            alert.textContent = message;
            
            // Add alert to document and alerts array
            document.body.appendChild(alert);
            alerts.push(alert);
            
            // Trigger animation after a small delay to ensure proper transition
            setTimeout(() => {
                repositionAlerts();
            }, 10);
            
            // Remove alert after 4 seconds
            setTimeout(() => {
                removeAlert(alert);
            }, 4000);
    }

    function repositionAlerts() {
        alerts.forEach((alert, index) => {
            // Calculate position for each alert
            const topPosition = 20 + (index * ALERT_HEIGHT);
            alert.style.top = topPosition + 'px';
            alert.classList.add('show');
         });
    }

    function removeAlert(alert) {
        const index = alerts.indexOf(alert);
        if (index > -1) {
            // Start slide out animation
            alert.classList.remove('show');
            alert.style.top = '-100px';
            
            // Remove from array
            alerts.splice(index, 1);
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                alert.remove();
                // Reposition remaining alerts
                repositionAlerts();
            }, 500);
        }
    }