export default async function handler(req, res) {
    const API_KEY = process.env.SMM_API_KEY; 
    const API_URL = "https://luvsmm.com/api/v2";

    if (!API_KEY) {
        return res.status(500).json({ error: "API Key is missing from Vercel Vault!" });
    }

    try {
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

        const exchangeRate = 98.00; 

        const cleanText = (text) => {
            if (!text) return "";
            return text.replace(/[^\x20-\x7E]/g, '').replace(/\s{2,}/g, ' ').trim();
        };

        const addIcon = (text) => {
            let lower = text.toLowerCase();
            if (lower.includes("instagram")) return "📸 " + text;
            if (lower.includes("youtube")) return "▶️ " + text;
            if (lower.includes("tiktok")) return "🎵 " + text;
            if (lower.includes("facebook")) return "📘 " + text;
            if (lower.includes("twitter") || lower.includes("x.com")) return "🐦 " + text;
            if (lower.includes("spotify")) return "🟢 " + text;
            if (lower.includes("telegram")) return "✈️ " + text;
            if (lower.includes("seo") || lower.includes("website")) return "🌐 " + text;
            return "🔹 " + text; 
        };

        const processedServices = originalData.map(service => {
            let priceInINR = parseFloat(service.rate) * exchangeRate;
            let finalPrice = priceInINR * 1.45;

            let cleanCategory = cleanText(service.category);
            let cleanName = cleanText(service.name);

          return {
                service_id: service.service,
                name: addIcon(cleanName),
                category: addIcon(cleanCategory),
                price: finalPrice.toFixed(2),
                min: service.min,
                max: service.max,
                desc: service.description || service.desc || ""
            };
        });

        res.status(200).json(processedServices);

    } catch (error) {
        res.status(500).json({ error: "Failed to load services.", details: error.message });
    }
}
