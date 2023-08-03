const { App } = require("@slack/bolt");
const { WebClient, LogLevel } = require("@slack/web-api");

const slackSigningSecret = "4d6408fe92876e058b99c2c167d68752";
const botToken = "xoxb-3538898510899-5626259179239-vQIX92nC9JsTIk2gb9guqtEM";
const appToken =
  "xapp-1-A05JN0K0G1L-5661679861730-99fdddf1b7be87072b6f916fb2a43d4352993db0a7556ec9ce3c1afd22f115fc";

const app = new App({
  token: botToken,
  signingSecret: slackSigningSecret,
  appToken,
  socketMode: true,
  port: process.env.PORT || 3000,
});

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(botToken, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

function createReleaseTextBlock(text) {
  const block = [
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
                type: "mrkdwn",
                text: "*Design Team*",
                // emoji: true,
              },
              value: "design",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Product Team*",
                // emoji: true,
              },
              value: "product",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Test Engineering Team*", //<@U04EAF9HWKH> <@U04TLGT3GRH>
                // emoji: true,
              },
              value: "test-engineer",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Translation Team*",
                // emoji: true,
              },
              value: "translation",
            },
          ],
          action_id: "app-verification-select",
        },
      ],
    },
  ];

  return block;
}

// When we initiate release command
app.command("/release-web-app", async ({ command, ack }) => {
  await ack();
  await sendMessagetoChannel("C05KDRCEUGZ", {
    blocks: createReleaseTextBlock(command.text),
  });
});

// When user selects the checkbox
app.action("app-verification-select", async ({ body, ack }) => {
  await ack();
  const allValues = ["product", "design", "test-engineer", "translation"];

  if (checkAllApproved(body.actions[0].selected_options, allValues)) {
    await sendMessagetoChannel("C05KDRCEUGZ", {
      text: "<@U040TPD5308> All the verification are submitted, production deployment is a go!!! :rocket:",
    });
  }
});

const checkAllApproved = (selectedOptions, allValues) => {
  const selectedValues = selectedOptions.map((optn) => optn.value);
  return allValues.every((item) => selectedValues.includes(item));
};

(async () => {
  // Start your app
  await app.start();

  console.log("⚡️ Bolt app is running!");
})();

// Function to send a message to Slack
async function sendMessagetoChannel(channel, messageObj) {
  try {
    await client.chat.postMessage({
      channel,
      ...messageObj,
    });
  } catch (err) {
    console.error(err);
  }
}
