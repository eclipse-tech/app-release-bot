const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000; // Change this port to your desired port number

// Your Slack app's signing secret
const slackSigningSecret = "4d6408fe92876e058b99c2c167d68752";

// Your Slack bot token
const botToken =
  "xoxb-3538898510899-5626259179239-94s4OuTntV3l8xfGkR0qX0Kj";

app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle /release-web-app command
app.post("/slack/command", (req, res) => {
  const { token, text, user_id, user_name } = req.body;

  // Verify the request is coming from Slack
  if (token !== slackSigningSecret) {
    return res.status(401).send("Unauthorized");
  }

  // Create checklists for Design Team, Product Team, Localization Team
  const payload = [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "Hi Team, \n \n We have deployed following changes in the uat environment, respective owner please verify the changes and click on the checkbox once verification is complete. If you encounter any bug please add those in this thread itself.",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "plain_text",
        text: text,
        emoji: true,
      },
    },
    {
      type: "divider",
    },
    {
      type: "context",
      elements: [
        {
          type: "plain_text",
          text: "Release Engineer: Minkesh Jain",
          emoji: true,
        },
      ],
    },
    {
      type: "actions",
      elements: [
        {
          type: "checkboxes",
          options: [
            {
              text: {
                type: "plain_text",
                text: "Design Team",
                emoji: true,
              },
              value: "design",
            },
            {
              text: {
                type: "plain_text",
                text: "Product Team",
                emoji: true,
              },
              value: "product",
            },
            {
              text: {
                type: "plain_text",
                text: "Test Engineering Team", //<@U04EAF9HWKH> <@U04TLGT3GRH>
                emoji: true,
              },
              value: "test-engineer",
            },
            {
              text: {
                type: "plain_text",
                text: "Translation Team",
                emoji: true,
              },
              value: "translation",
            },
          ],
        },
      ],
    },
  ];
  // Send the checklist message
  sendSlackMessage("#deploy-notifier", JSON.stringify(payload));

  res.send(`Command received: ${text}`);
});

// Route to handle interactive messages (checklist button clicks)
app.post("/slack/interactions", (req, res) => {
  const payload = JSON.parse(req.body.payload);
  console.log(payload);
  // Check if the action is from a checklist button
  if (payload.type === "block_actions" && payload.actions.length > 0) {
    const value = payload.actions[0].value;

    // Notify @minkesh when all checklists are checked
    if (value === "design" || value === "product" || value === "localization") {
      const checklistCompleteMessage = `All checklists for *${value}* are checked!`;
      sendSlackMessage("@minkesh", checklistCompleteMessage);
    }
  }

  res.send();
});

// Function to send a message to Slack
async function sendSlackMessage(channel, message) {
  try {
    await axios.post(
      "https://slack.com/api/chat.postMessage",
      {
        channel,
        blocks: message,
      },
      {
        headers: {
          Authorization: `Bearer ${botToken}`,
        },
      }
    );
  } catch (err) {
    console.error(err);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
