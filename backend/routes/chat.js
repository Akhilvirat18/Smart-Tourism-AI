const express = require("express");
const router = express.Router();

// Attraction database
const attractions = {
  waterfalls: ["Dassam Falls", "Hundru Falls", "Jonha Falls"],
  nature: ["Patratu Valley", "Netarhat", "Hirni Falls"],
  temples: ["Sun Temple", "Jagannath Temple"],
  heritage: ["Rock Garden", "Pahari Mandir"],
};

// 1️⃣ Detect language (Hindi vs English)
function detectLanguage(text) {
  const hindiChars = /[\u0900-\u097F]/;
  return hindiChars.test(text) ? "hi" : "en";
}

// 2️⃣ Sentiment detection
function detectSentiment(text) {
  const happyWords = ["good", "nice", "great", "awesome", "love", "excited"];
  const sadWords = ["sad", "bad", "tired", "upset", "boring"];
  const lower = text.toLowerCase();

  if (happyWords.some((w) => lower.includes(w))) return "positive";
  if (sadWords.some((w) => lower.includes(w))) return "negative";
  return "neutral";
}

// 3️⃣ Auto Itinerary Generator
function generateItinerary(days) {
  let plan = `Here is your ${days}-day itinerary:\n\n`;

  const places = [
    "Sun Temple",
    "Rock Garden",
    "Ranchi Lake",
    "Dassam Falls",
    "Patratu Valley",
    "Hundru Falls",
  ];

  for (let i = 1; i <= days; i++) {
    plan += `🗓 Day ${i}: ${places[i - 1] || "Free exploration"}\n`;
  }
  return plan;
}

// Main chatbot endpoint
router.post("/ask", async (req, res) => {
  const { question } = req.body;
  const q = question.toLowerCase();

  // Detect language & sentiment
  const lang = detectLanguage(question);
  const sentiment = detectSentiment(question);

  let reply = "";

  // 1. Greetings
  if (q.includes("hello") || q.includes("hi")) {
    reply =
      lang === "hi"
        ? "नमस्ते! 👋 आपकी यात्रा में कैसे मदद कर सकता हूँ?"
        : "Hello! 👋 How can I help you with your travel plan?";
  }

  // 2. Mood based handling
  else if (sentiment === "positive") {
    reply = "Great to hear that! 😊 How can I make your trip even better?";
  } else if (sentiment === "negative") {
    reply =
      lang === "hi"
        ? "मुझे अफसोस है कि आप अच्छा महसूस नहीं कर रहे हैं। क्या मैं आपकी यात्रा को आसान बनाने में मदद कर सकता हूँ?"
        : "I'm sorry you're feeling low. Want me to help you plan a relaxing trip?";
  }

  // 3. Waterfalls
  else if (q.includes("waterfall") || q.includes("falls")) {
    reply = `Here are some beautiful waterfalls:\n• ${attractions.waterfalls.join(
      "\n• "
    )}`;
  }

  // 4. Temples
  else if (q.includes("temple")) {
    reply = `Popular temples:\n• ${attractions.temples.join("\n• ")}`;
  }

  // 5. Nature
  else if (q.includes("nature") || q.includes("valley")) {
    reply = `Best nature spots:\n• ${attractions.nature.join("\n• ")}`;
  }

  // 6. Auto itinerary: “plan 3 days trip”
  else if (q.includes("day") && q.includes("plan")) {
    const num = q.match(/\d+/);
    if (num) reply = generateItinerary(parseInt(num[0]));
    else reply = "How many days are you planning?";
  }

  // 7. Recommendation Engine
  else if (q.includes("suggest") || q.includes("recommend")) {
    reply = `I recommend visiting:\n🌄 Patratu Valley\n💦 Dassam Falls\n🏞 Rock Garden`;
  }

  // 8. Food
  else if (q.includes("food") || q.includes("eat")) {
    reply =
      lang === "hi"
        ? "झारखंड के प्रसिद्ध व्यंजन: धुस्का, पिठा, लिट्टी चोखा, हैंडिया।"
        : "Popular foods in Jharkhand: Dhuska, Pitha, Litti-Chokha, Handia.";
  }

  // Default fallback
  else {
    reply =
      lang === "hi"
        ? "मैंने समझा नहीं। कृपया दोबारा बताएं।"
        : "I didn’t understand that. Can you rephrase?";
  }

  res.json({ reply });
});

module.exports = router;
