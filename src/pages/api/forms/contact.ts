import type { APIRoute } from 'astro'
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

    console.log('✅ Contact form submission saved to Sanity:', submission._id)

    // Redirect to success page on successful submission
    // Netlify will handle email notifications automatically
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
