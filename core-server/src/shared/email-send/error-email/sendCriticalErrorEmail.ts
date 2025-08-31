// /* eslint-disable @typescript-eslint/ban-ts-comment */
// import { EmailParams, Recipient } from "mailersend";
// import { IErrorDetails } from "../../../interfaces/email/criticalEmailType";
// import { errorLogger, infoLogger } from "../../logger";
// import { mailerSend, supportEmailSender } from "../key/mailerSenderKey";

// export const sendEmailForCriticalError = async (details: IErrorDetails) => {
//   try {
//     const recipients = [new Recipient(details?.receiverEmail), new Recipient(details?.receiverEmailAnother)];

//     const emailParams = new EmailParams()
//       .setFrom(supportEmailSender)
//       .setTo(recipients)
//       .setReplyTo(supportEmailSender)
//       .setSubject("Immediate Attention Required: Critical Error Occurred on Core Server").setHtml(`<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Critical Server Error Notification</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f4f4f4;
//       margin: 0;
//       padding: 0;
//     }

//     .email-container {
//       max-width: 600px;
//       margin: 20px auto;
//       background-color: #ffffff;
//       border-radius: 8px;
//       overflow: hidden;
//       box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//     }

//     .email-header {
//       background-color: #b71c1c;
//       color: #ffffff;
//       text-align: center;
//       padding: 10px 20px;
//       border-radius: 8px 8px 0 0;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }

//     .email-header h1 {
//       margin: 0;
//       font-size: 24px;
//     }

//     .email-header img {
//       width: 40px;
//       height: 40px;
//       margin-right: 10px;
//     }

//     .email-body {
//       padding: 20px;
//       line-height: 1.6;
//       color: #333333;
//     }

//     .email-body p {
//       margin: 0 0 10px;
//     }

//     .error-details {
//       background-color: #f8d7da;
//       border: 1px solid #f5c6cb;
//       color: #721c24;
//       padding: 10px;
//       border-radius: 5px;
//       margin: 15px 0;
//       word-wrap: break-word;
//     }

//     .email-footer {
//       background-color: #f1f1f1;
//       padding: 15px;
//       text-align: center;
//       font-size: 14px;
//       color: #555555;
//       border-radius: 0 0 8px 8px;
//     }

//     @media only screen and (max-width: 600px) {
//       .email-container {
//         width: 100% !important;
//       }

//       .email-header h1 {
//         font-size: 20px;
//       }

//       .email-body {
//         padding: 10px;
//       }
//     }
//   </style>
// </head>

// <body>

//   <div class="email-container">
//     <!-- Email Header -->
//     <div class="email-header">
//       <img src="https://img.icons8.com/color/48/000000/error--v1.png" alt="Error Icon">
//       <h1>Critical Server Error</h1>
//     </div>

//     <!-- Email Body -->
//     <div class="email-body">
//       <p>Dear Developer,</p>
//       <p>An important error has occurred on the server that requires your immediate attention.</p>

//       <div class="error-details">
//         <strong>Error Details:</strong>
//         <p><strong>Error Message:</strong> ${details.errorMessage || "No error message available."}</p>
//         <p><strong>Error Name:</strong> ${details.errorName || "No error name available."}</p>
//         <p><strong>Stack Trace:</strong></p>
//         <pre>${details.stackTrace || "No stack trace available."}</pre>
//         <p><strong>Occurred At:</strong> ${details.occurredAt ? new Date(details.occurredAt).toLocaleString() : "N/A"}</p>
//         <p><strong>Service Name:</strong> ${details.serviceName || "N/A"}</p>
//         <p><strong>Request ID:</strong> ${details.requestId || "N/A"}</p>
//         <p><strong>Additional Info:</strong></p>
//         <pre>${details.additionalInfo ? JSON.stringify(details.additionalInfo, null, 2) : "No additional information available."}</pre>
//       </div>

//       <p>Please investigate and resolve the issue as soon as possible. If further details are required, refer to the server logs or contact the operations team.</p>
//       <p>Thank you,</p>
//       <p>System Notification</p>
//     </div>

//     <!-- Footer -->
//     <div class="email-footer">
//       © 2024 All rights reserved | CODEQUIVERS
//     </div>
//   </div>

// </body>
// </html>

// `);

//     await mailerSend.email.send(emailParams);
//     infoLogger.info(`Email notification sent to - ${details?.receiverEmail} & ${details?.receiverEmailAnother} for conversation message received.`);
//   } catch (error) {
//     errorLogger.error(`Failed to send email to : ${details?.receiverEmail} & ${details?.receiverEmailAnother}`, error);
//   }
// };
