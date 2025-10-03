document.addEventListener('DOMContentLoaded', function() {
    const apiKeyForm = document.getElementById('apiKeyForm');
    const resultDiv = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');
    
    apiKeyForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const service = document.getElementById('service').value;
        const apiKey = document.getElementById('apiKey').value;
        
        // Show loading state
        resultDiv.className = 'result';
        resultMessage.textContent = 'Validating your API key...';
        resultDiv.classList.remove('hidden');
        
        try {
            const response = await fetch('/api/validate-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ apiKey, service })
            });
            
            const data = await response.json();
            
            if (data.valid) {
                resultDiv.classList.add('valid');
                resultMessage.textContent = `✓ ${data.message}`;
            } else {
                resultDiv.classList.add('invalid');
                resultMessage.textContent = `✗ ${data.message}`;
            }
        } catch (error) {
            resultDiv.classList.add('invalid');
            resultMessage.textContent = '✗ Error validating API key. Please try again.';
            console.error('Error:', error);
        }
    });
});