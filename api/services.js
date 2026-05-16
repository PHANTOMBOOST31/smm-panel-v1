export default async function handler(req, res) {
    // DO NOT PASTE YOUR REAL KEY HERE! 
    // This line securely pulls your hidden key from Vercel's vault.
    const API_KEY = process.env.SMM_API_KEY; 
    const API_URL = "https://smmwins.com/api/v2";

    // Safety check to ensure Vercel has the key
    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing from Vercel Vault!" });
    }

    try {
        // Securely ask smmwins.com for their list
        const response = await fetch(`${API_URL}?key=${API_KEY}&action=services`);
        const originalData = await response.json();

        // Safety check: ensure the provider didn't send an error message
        if (!Array.isArray(originalData)) {
            return res.status(500).json({ error: "Invalid response from provider API." });
        }

        // Loop through the list and add your 40% profit markup
        const processedServices = originalData.map(service => {
            let newPrice = parseFloat(service.rate) * 1.40;

            return {
                service_id: service.service,
                name: service.name,
                category: service.category,
                price: newPrice.toFixed(2),
                min: service.min,
                max: service.max
            };
        });

        // Send the profitable list back to your website
        res.status(200).json(processedServices);

    } catch (error) {
        res.status(500).json({ error: "Failed to load services.", details: error.message });
    }
}
