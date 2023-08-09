const { App, AwsLambdaReceiver } = require("@slack/bolt");
const { WebClient, LogLevel } = require("@slack/web-api");
const { createReleaseTextBlock } = require("./block-helper");

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
});

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG,
});

// Initiate release command
app.command("/release-web-app", async ({ command, ack }) => {
  await ack();
  await sendMessagetoChannel("C05KDRCEUGZ", {
    blocks: createReleaseTextBlock(command.text),
  });
});

// app.command("/add-issue", async ({ ack, body, client, logger }) => {
//   await ack();

//   await client.views.open({
//     trigger_id: body.trigger_id,
//     ...createAddIssueModalBlock("add_issue_cb"),
//   });
// });

// app.view("add_issue_cb", async ({ ack, body, view, client, logger }) => {
//   await ack();

//   const {
//     issue_title_block: {
//       issue_title_input: { value: title },
//     },
//     issue_desc_block: {
//       issue_desc_input: { value: desc },
//     },
//     issue_type_input_block: {
//       issue_type: { selected_option: { value: issueType } },
//     },
//   } = view["state"]["values"];

// });

// When user selects the checkbox
app.action("app-verification-select", async ({ body, ack }) => {
  await ack();
  const allValues = [
    "product",
    "design",
    "test-engineer",
    "translation",
    "backend",
  ];

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
};
