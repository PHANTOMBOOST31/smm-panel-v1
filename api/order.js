export default async function handler(req, res) {
    // Only accept POST requests for security
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed. Use POST." });
    }

    const API_KEY = process.env.SMM_API_KEY; 
    const API_URL = "https://luvsmm.com/api/v2";

    // Grab the order details sent by your dashboard
    const { service, link, quantity } = req.body;

    // Security check
    if (!service || !link || !quantity) {
        return res.status(400).json({ error: "Missing order details." });
    }
    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing from Vercel Vault!" });
    }

    try {
        // Send the official order securely to LuvSMM
        const response = await fetch(`${API_URL}?key=${API_KEY}&action=add&service=${service}&link=${link}&quantity=${quantity}`);
        const originalData = await response.json();

        // If LuvSMM rejects it (e.g., not enough wholesale balance)
        if (originalData.error) {
            return res.status(400).json({ error: originalData.error });
        }

        // Send LuvSMM's official receipt ticket back to your website
        res.status(200).json(originalData);

    } catch (error) {
        res.status(500).json({ error: "Failed to place order with provider.", details: error.message });
    }
}
