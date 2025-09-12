// netlify/functions/discord-webhook.js
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const { name, subject, message } = body;

    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookURL) {
      return { statusCode: 500, body: "Webhook not configured" };
    }

    const embed = {
      title: subject || "New Message",
      color: 0xF89710,
      fields: [
        { name: "From", value: name || "Anonymous", inline: true },
        { name: "Message", value: message || "(No message)", inline: false }
      ],
      timestamp: new Date().toISOString()
    };

    const res = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: "Discord error: " + text };
    }

    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
