export default async function handler(req, res) {
    const API_KEY = process.env.SMM_API_KEY; 
    const API_URL = "https://smmwiz.com/api/v2";

    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing from Vercel Vault!" });
    }

    try {
        // We added a "fake ID" here so SMM Wiz's security doesn't block Vercel
        const response = await fetch(`${API_URL}?key=${API_KEY}&action=services`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });
        
        const originalData = await response.json();

        if (!Array.isArray(originalData)) {
            return res.status(500).json({ error: "Invalid response from provider API." });
        }

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

        res.status(200).json(processedServices);

    } catch (error) {
        res.status(500).json({ error: "Failed to load services.", details: error.message });
    }
}
