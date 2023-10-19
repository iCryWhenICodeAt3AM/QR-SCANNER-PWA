document.addEventListener('DOMContentLoaded', function () {
    let lastScannedTimestamp = 0;
    const scanDelay = 5000; // 2 seconds

    function onScanSuccess(decodedText, decodedResult) {
        console.log(`Code matched = ${decodedText}`, decodedResult);

        // Check if enough time has passed since the last scan
        const currentTime = Date.now();
        if (currentTime - lastScannedTimestamp < scanDelay) {
            return; // Skip this scan if it's too soon
        }

        // Update the last scanned timestamp
        lastScannedTimestamp = currentTime;

        google.script.run.addDataToSheet(decodedText); // Send the decoded text to Google Apps Script

        const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
        const appendAlert = (message, type) => {
            const wrapper = document.createElement('div');
            const alertDiv = document.createElement('div');
            alertDiv.className = `alert alert-${type} alert-dismissible`;
            alertDiv.setAttribute('role', 'alert');
            alertDiv.innerHTML = `
                <div>${message}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;

            wrapper.appendChild(alertDiv);
            alertPlaceholder.appendChild(wrapper);

            // Automatically dismiss the alert after 3 seconds (adjust as needed)
            setTimeout(() => {
                alertDiv.remove();
            }, 3000);
        }

        appendAlert(`${decodedText} is recorded!`, 'info');
    }

    function onScanFailure(error) {
        console.warn(`Code scan error = ${error}`); // handle scan failure, usually better to ignore and keep scanning.
    }

    let html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        {
            fps: 10,
            qrbox: { width: 500, height: 500 },
        },
        /* verbose= */ false
    );
    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
});