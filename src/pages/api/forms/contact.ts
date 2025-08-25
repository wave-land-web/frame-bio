// export const prerender = false

// import { render } from '@react-email/render'
// import type { APIRoute } from 'astro'
// import Notification from '../../../components/emails/Notification'
// import Welcome from '../../../components/emails/Welcome'
// import { resend } from '../../../lib/resend'
// import { sanityClient } from '../../../sanity/lib/client'

// export const POST: APIRoute = async ({ request }) => {
//   try {
//     // Extract form data
//     const formData = await request.formData()
//     const firstName = formData.get('firstName')?.toString()
//     const lastName = formData.get('lastName')?.toString()
//     const businessName = formData.get('businessName')?.toString()
//     const email = formData.get('email')?.toString()
//     const phone = formData.get('phone')?.toString()
//     const message = formData.get('message')?.toString()
//     const isSubscribed = formData.get('isSubscribed') === 'on' // Checkbox values are 'on' when checked

//     // Validate required fields
//     if (!firstName || !lastName || !businessName || !email || !phone) {
//       return new Response(
//         JSON.stringify({
//           success: false,
//           message: 'All fields are required',
//           missing: {
//             firstName: !firstName,
//             lastName: !lastName,
//             businessName: !businessName,
//             email: !email,
//             phone: !phone,
//           },
//         }),
//         {
//           status: 400,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       )
//     }

//     // Check if user already exists by email
//     const existingUser = await sanityClient.fetch(`*[_type == "user" && email == $email][0]`, {
//       email: email.trim().toLowerCase(),
//     })

//     let result
//     let isNewUser = false
//     const userData = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       businessName: businessName.trim(),
//       email: email.trim().toLowerCase(),
//       phone: phone.trim(),
//       message: message ? message.trim() : '',
//       isSubscribed: isSubscribed || false,
//     }

//     if (existingUser) {
//       // Update existing user
//       result = await sanityClient
//         .patch(existingUser._id)
//         .set({
//           ...userData,
//           updatedAt: new Date().toISOString(),
//         })
//         .commit()
//     } else {
//       // Create new user
//       isNewUser = true
//       const userDoc = {
//         _type: 'user',
//         ...userData,
//         createdAt: new Date().toISOString(),
//       }

//       result = await sanityClient.create(userDoc)
//     }

//     // Handle Resend audience management and welcome emails
//     let resendContactId = null

//     // Determine if we should send a welcome email
//     const shouldSendWelcomeEmail =
//       isNewUser || (userData.isSubscribed && !existingUser?.isSubscribed)

//     if (userData.isSubscribed) {
//       try {
//         // For existing users, check if they were previously subscribed
//         const shouldCreateContact = isNewUser || !existingUser?.isSubscribed

//         if (shouldCreateContact) {
//           const resendResponse = await resend.contacts.create({
//             email: userData.email,
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             audienceId: import.meta.env.RESEND_AUDIENCE_ID,
//           })

//           // Handle successful response
//           if (resendResponse.data) {
//             resendContactId = resendResponse.data.id
//           }
//         } else {
//           // User was already subscribed, no need to create new contact
//           console.log('User already subscribed to Resend audience')
//         }
//       } catch (resendError) {
//         console.error('Error adding contact to Resend audience:', resendError)
//         // Don't fail the entire request if Resend fails
//         // The contact is still saved in Sanity
//       }
//     }

//     // Prepare emails to send using batch API
//     const emailsToSend = []

//     // Prepare welcome email if appropriate
//     if (shouldSendWelcomeEmail) {
//       try {
//         // Create params for the welcome email
//         const emailParams = {
//           email,
//           firstName,
//           isSubscribed: userData.isSubscribed,
//         }

//         // Render the welcome email as plain text
//         const welcomeText = await render(Welcome(emailParams), {
//           plainText: true,
//         })

//         // Add welcome email to batch
//         emailsToSend.push({
//           from: 'Frame Bio <hello@wavelandweb.com>',
//           to: [userData.email],
//           subject: userData.isSubscribed
//             ? 'Welcome to Frame Bio'
//             : 'Thank you for contacting Frame Bio',
//           react: Welcome(emailParams),
//           text: welcomeText,
//         })
//       } catch (emailError) {
//         console.error('Error preparing welcome email:', emailError)
//       }
//     }

//     // Prepare notification email to <your-email>@gmail.com
//     try {
//       const notificationParams = {
//         firstName,
//         lastName,
//         businessName,
//         email,
//         phone,
//         message,
//         isSubscribed: userData.isSubscribed,
//       }

//       // Render the notification email as plain text
//       const notificationText = await render(Notification(notificationParams), {
//         plainText: true,
//       })

//       // Add notification email to batch
//       emailsToSend.push({
//         from: 'Frame Bio Website <hello@wavelandweb.com>',
//         to: ['josh@wavelandweb.com'],
//         subject: `New contact form submission from ${firstName} ${lastName}`,
//         react: Notification(notificationParams),
//         text: notificationText,
//       })
//     } catch (notificationError) {
//       console.error('Error preparing notification email:', notificationError)
//     }

//     // Send all emails in a single batch request (if any emails to send)
//     if (emailsToSend.length > 0) {
//       try {
//         const { data: batchData, error: batchError } = await resend.batch.send(emailsToSend)

//         if (batchError) {
//           console.error('Error sending batch emails:', batchError)
//           // Don't fail the entire request if batch email fails
//         } else {
//           console.log(`Successfully sent ${emailsToSend.length} emails in batch`)
//         }
//       } catch (batchError) {
//         console.error('Error sending batch emails:', batchError)
//         // Don't fail the entire request if batch email fails
//       }
//     }

//     return new Response(
//       JSON.stringify({
//         success: true,
//         message: 'We have received your message and will get back to you shortly.',
//         id: result._id,
//         isSubscribed: userData.isSubscribed,
//         resendContactId,
//         isNewUser,
//       }),
//       {
//         status: 201,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     )
//   } catch (error) {
//     console.error('Error sending message:', error)

//     return new Response(
//       JSON.stringify({
//         success: false,
//         message: 'Failed to send your message. Please try again later.',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       }),
//       {
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       }
//     )
//   }
// }
