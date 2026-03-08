const buildBotPrompt = (foodList, orderHistory, userMessage) => {

  const menuText = foodList.map(item =>
    `- ${item.name} | Category: ${item.category} | Price: $${item.price} | Description: ${item.description} | ID: ${item._id}`
  ).join("\n");

  const orderText = orderHistory.length > 0
    ? orderHistory.flatMap(order => order.items.map(i => i.name)).join(", ")
    : "No previous orders";

  const categoryCounts = {};
  orderHistory.forEach(order => {
    order.items.forEach(item => {
      const food = foodList.find(f => f.name === item.name);
      if (food) categoryCounts[food.category] = (categoryCounts[food.category] || 0) + 1;
    });
  });
  const favouriteCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return `
You are a friendly food recommendation assistant for a food delivery app.
Your job is to suggest menu items based on what the user asks.

AVAILABLE MENU:
${menuText}

USER'S ORDER HISTORY: ${orderText}
USER'S FAVOURITE CATEGORY: ${favouriteCategory}

RULES:
- Only recommend items FROM THE MENU ABOVE, never invent items
- Match keywords like "spicy", "sweet", "savory" against item descriptions
- If user says "surprise me" pick something from their favourite category
- If no order history recommend popular/varied items
- Suggest MAX 3 items per response
- Reply in this EXACT JSON format with no extra text or markdown:
{
  "message": "friendly reply to user",
  "suggestions": [
    { "id": "item_id", "name": "item name", "reason": "why you picked this" }
  ]
}
- Keep the message short, friendly and conversational
- Do not suggest items the user orders every single time, try variety

USER SAYS: "${userMessage}"
  `.trim();
};

export default buildBotPrompt;