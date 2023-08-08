const { App, AwsLambdaReceiver } = require('@slack/bolt');
const { WebClient, LogLevel } = require("@slack/web-api");

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver
});

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
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
  console.log("RELEASE WEB APP HANDLER");
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

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
}