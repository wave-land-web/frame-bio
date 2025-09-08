import { render } from '@react-email/render'
import type { APIRoute } from 'astro'
import AdminContactNotification from '../../../components/emails/AdminContactNotification'
import UserContactNotification from '../../../components/emails/UserContactNotification'
import { resend } from '../../../lib/resend'
import { sanityClient } from '../../../sanity/lib/client'
import {
  createContactFormSubmission,
  type ContactFormData,
} from '../../../sanity/lib/formSubmissions'

export const prerender = false // Enable server-side rendering for form handling

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    // Parse form data from the request
    const formData = await request.formData()

    // Basic spam protection: Check honeypot field
    const honeypot = formData.get('bot-field')
    if (honeypot) {
      console.log('🍯 Honeypot triggered - potential spam submission blocked')
      // Silently redirect to success page to not alert bots
      return redirect('/success', 302)
    }

    // Extract form fields and validate required fields
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const businessName = formData.get('businessName') as string
    const jobTitle = formData.get('jobTitle') as string
    const emailAddress = formData.get('email') as string
    const phoneNumber = formData.get('phone') as string
    const messageBody = formData.get('message') as string

    // Validate required fields
    if (!firstName || !lastName || !businessName || !jobTitle || !emailAddress || !phoneNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            'Missing required fields: firstName, lastName, businessName, jobTitle, emailAddress, and phoneNumber are required.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailAddress)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid email address format.',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Use Sanity client (automatically optimizes for read/write operations)
    const client = sanityClient

    // Prepare contact form data
    const contactData: ContactFormData = {
      firstName,
      lastName,
      businessName,
      jobTitle,
      emailAddress,
      phoneNumber,
      messageBody: messageBody || undefined,
    }

    // Create contact form submission in Sanity
    const submission = await createContactFormSubmission(client, contactData)

    // Prepare emails to send using batch API
    const emailsToSend = []

    // Send user confirmation email
    try {
      console.log('Preparing user confirmation email for contact form submission...')

      // Generate HTML version of user confirmation
      const userConfirmationHtml = await render(
        UserContactNotification({
          firstName,
        })
      )

      // Generate text version of user confirmation
      const userConfirmationText = await render(
        UserContactNotification({
          firstName,
        }),
        {
          plainText: true,
        }
      )

      emailsToSend.push({
        from: 'Frame Bio <noreply@frame.bio>',
        to: [emailAddress],
        subject: 'Thank you for contacting Frame Bio',
        html: userConfirmationHtml,
        text: userConfirmationText,
      })
    } catch (userEmailError) {
      console.error('Failed to prepare user confirmation email:', userEmailError)
      // Continue execution - admin notification can still be sent
    }

    // Send admin notification email
    try {
      console.log('Preparing admin notification for contact form submission...')

      // Generate HTML version of admin notification
      const notificationHtml = await render(
        AdminContactNotification({
          firstName,
          lastName,
          email: emailAddress,
          phone: phoneNumber,
          message: messageBody,
        })
      )

      // Generate text version of admin notification
      const notificationText = await render(
        AdminContactNotification({
          firstName,
          lastName,
          email: emailAddress,
          phone: phoneNumber,
          message: messageBody,
        }),
        {
          plainText: true,
        }
      )

      emailsToSend.push({
        from: 'Frame Bio <noreply@frame.bio>',
        to: ['questions@frame.bio'],
        subject: `New contact form submission from ${firstName} ${lastName}`,
        html: notificationHtml,
        text: notificationText,
      })
    } catch (adminEmailError) {
      console.error('Failed to prepare admin notification email:', adminEmailError)
      // Continue execution - user confirmation can still be sent
    }

    // Send all emails in batch
    if (emailsToSend.length > 0) {
      try {
        const { data: batchData, error: batchError } = await resend.batch.send(emailsToSend)

        if (batchError) {
          console.error('Error sending batch emails:', batchError)
        } else {
          console.log(`Successfully sent ${emailsToSend.length} emails:`, batchData)
        }
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Continue execution - form submission succeeded even if email failed
      }
    }

    // Redirect to success page on successful submission
    return redirect('/success', 302)
  } catch (error) {
    console.error('Contact form submission error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'An error occurred while processing your request.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// Handle preflight OPTIONS requests for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
