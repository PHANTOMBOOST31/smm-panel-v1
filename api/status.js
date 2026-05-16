export default async function handler(req, res) {
    const API_KEY = process.env.SMM_API_KEY; 
    const API_URL = "https://luvsmm.com/api/v2";

    // Grab the specific order ID from the dashboard request
    const { order } = req.query;

    if (!order) {
        return res.status(400).json({ error: "Missing order ID." });
    }
    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing from Vercel Vault!" });
    }

    try {
        // Securely ask LuvSMM for the live status of this specific order
        const response = await fetch(`${API_URL}?key=${API_KEY}&action=status&order=${order}`);
        const statusData = await response.json();

        if (statusData.error) {
            return res.status(400).json({ error: statusData.error });
        }

        // Send the live status (Pending, In progress, Completed) back to the website
        res.status(200).json(statusData);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch status.", details: error.message });
    }
}
