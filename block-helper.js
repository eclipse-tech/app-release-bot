function createReleaseTextBlock(text) {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Hi Team, \n \n We have deployed following changes in the uat environment, respective owners please verify the changes and check the checkbox once verification is complete. \n \n Any bugs found, please add those in the sheet <https://docs.google.com/spreadsheets/d/1TSH_P7TL_j9pFK_bw-SrPZUZaIgGJc1P7XBZspdgjNo/edit#gid=2145155761 | here>",
        // emoji: true,
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
                text: "*Backend Team* <@U03SPDVCEDA>",
              },
              value: "backend",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Product Team* <@U041536PMU4>",
              },
              value: "product",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Design Team* <@U04KEQ1BSQ2>",
              },
              value: "design",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Test Engineering Team* <@U04TLGT3GRH>", //<@U04EAF9HWKH> <@U04TLGT3GRH>
              },
              value: "test-engineer",
            },
            {
              text: {
                type: "mrkdwn",
                text: "*Translation Team* <@U03FW2X6LBF>",
              },
              value: "translation",
            },
          ],
          action_id: "app-verification-select",
        },
      ],
    },
  ];
}

// function createAddIssueModalBlock(callbackId) {
//   return {
//     view: {
//       type: "modal",
//       callback_id: callbackId,
//       title: {
//         type: "plain_text",
//         text: "Add New Issue",
//         emoji: true,
//       },
//       submit: {
//         type: "plain_text",
//         text: "Submit",
//         emoji: true,
//       },
//       close: {
//         type: "plain_text",
//         text: "Cancel",
//         emoji: true,
//       },
//       blocks: [
//         {
//           type: "input",
//           block_id: "issue_title_block",
//           element: {
//             type: "plain_text_input",
//             action_id: "issue_title_input",
//           },
//           label: {
//             type: "plain_text",
//             text: "Issue Title",
//             emoji: true,
//           },
//         },
//         {
//           type: "input",
//           block_id: "issue_desc_block",
//           element: {
//             type: "plain_text_input",
//             multiline: true,
//             action_id: "issue_desc_input",
//           },
//           label: {
//             type: "plain_text",
//             text: "Issue Description",
//             emoji: true,
//           },
//         },
//         {
//           type: "input",
//           block_id: "issue_type_input_block",
//           element: {
//             type: "static_select",
//             placeholder: {
//               type: "plain_text",
//               text: "Issue Type",
//               emoji: true,
//             },
//             options: [
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "UI",
//                   emoji: true,
//                 },
//                 value: "frontend",
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Data",
//                   emoji: true,
//                 },
//                 value: "backend",
//               },
//               {
//                 text: {
//                   type: "plain_text",
//                   text: "Product",
//                   emoji: true,
//                 },
//                 value: "product",
//               },
//             ],
//             action_id: "issue_type",
//           },
//           label: {
//             type: "plain_text",
//             text: "Choose Issue Type",
//             emoji: true,
//           },
//         },
//       ],
//     },
//   };
// }

module.exports = {
  createReleaseTextBlock
};
