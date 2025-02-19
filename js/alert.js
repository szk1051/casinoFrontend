const alerts = [];
    const ALERT_HEIGHT = 70;
        
    function showAlert(message, type) {
            const alert = document.createElement('div');
            alert.className = `alert ${type}`;
            alert.textContent = message;
            
            document.body.appendChild(alert);
            alerts.push(alert);
            
            setTimeout(() => {
                repositionAlerts();
            }, 10);
            
            setTimeout(() => {
                removeAlert(alert);
            }, 4000);
    }

    function repositionAlerts() {
        alerts.forEach((alert, index) => {
            const topPosition = 20 + (index * ALERT_HEIGHT);
            alert.style.top = topPosition + 'px';
            alert.classList.add('show');
         });
    }

    function removeAlert(alert) {
        const index = alerts.indexOf(alert);
        if (index > -1) {
            alert.classList.remove('show');
            alert.style.top = '-100px';
            
            alerts.splice(index, 1);
            
            setTimeout(() => {
                alert.remove();
                repositionAlerts();
            }, 500);
        }
    }