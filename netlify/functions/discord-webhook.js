// netlify/functions/discord-webhook.js
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse body robustly
    let body = event.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        console.error("Failed to parse event.body as JSON:", err);
        body = {};
      }
    }

    console.log("Function received body:", body); // <-- CHECK THIS LOG in Netlify UI

    const name = (body.name || "Anonymous").toString();
    const subject = (body.subject || "New Message").toString();
    let message = (body.message || "").toString().trim();

    // If message empty, use explicit placeholder
    const messageForEmbed = message.length ? message : "(No message)";

    // Discord embed field values must be <= 1024 chars
    const MAX_FIELD = 1024;
    const safeMessage = messageForEmbed.length > MAX_FIELD
      ? messageForEmbed.slice(0, MAX_FIELD - 3) + "..."
      : messageForEmbed;

    const embed = {
      title: subject,
      color: 0xF89710,
      fields: [
        { name: "From", value: name, inline: true },
        { name: "Message", value: safeMessage, inline: false }
      ],
      timestamp: new Date().toISOString()
    };

    const webhookURL = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookURL) {
      console.error("DISCORD_WEBHOOK_URL not configured");
      return { statusCode: 500, body: "Webhook not configured" };
    }

    const res = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Discord responded with error:", res.status, text);
      return { statusCode: res.status, body: "Discord error: " + text };
    }

    // Return the body we received so you can confirm easily during testing
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, received: body })
    };

  } catch (err) {
    console.error("Handler error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
