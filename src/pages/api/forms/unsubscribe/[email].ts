export const prerender = false

import { render } from '@react-email/components'
import type { APIRoute } from 'astro'
import Unsubscribe from '../../../../components/emails/Unsubscribe'
import { resend } from '../../../../lib/resend'
import { sanityClient } from '../../../../sanity/lib/client'

/**
 * GET request handler for unsubscribing an email.
 *
 * @param params The request parameters.
 * @param redirect The redirect function.
 * @returns The response object.
 */
export const GET: APIRoute = async ({ params, redirect }) => {
  // Extract the email from the URL
  const { email } = params

  // If there is no email in the URL >> return an error
  if (!email) {
    return new Response(null, {
      status: 404,
      statusText: 'Email Not found',
    })
  }

  const sanitizedEmail = email.trim().toLowerCase()

  // Query for the user document by email to get firstName
  const query = '*[_type == "user" && email == $email][0]'
  const existingUser = await sanityClient.fetch(query, { email: sanitizedEmail })

  // Update subscription status in Sanity
  if (existingUser) {
    await sanityClient
      .patch(existingUser._id)
      .set({
        isSubscribed: false,
        unsubscribedAt: new Date().toISOString(),
      })
      .commit()
  }

  // Handle unsubscription from the Resend audience
  const { data: unsubscribeData, error: unsubscribeError } = await resend.contacts.update({
    email: sanitizedEmail,
    audienceId: import.meta.env.RESEND_AUDIENCE_ID,
    unsubscribed: true,
  })

  // Log the response from Resend
  console.log(unsubscribeData, unsubscribeError)

  // Render the Unsubscribe email as plain text
  const text = await render(Unsubscribe({ firstName: existingUser?.firstName || 'there' }), {
    plainText: true,
  })

  // Send an email to the user confirming their unsubscription
  const { data: unsubscribeEmailData, error: unsubscribeEmailError } = await resend.emails.send({
    from: 'Frame Bio <hello@wavelandweb.com>',
    to: sanitizedEmail,
    subject: 'You have been unsubscribed from Frame Bio',
    react: Unsubscribe({
      firstName: existingUser?.firstName || 'there',
    }),
    text,
  })

  // Log the response from Resend
  console.log(unsubscribeEmailData, unsubscribeEmailError)

  // If there was an error unsubscribing the user >> return an error
  if (unsubscribeError?.message) {
    return new Response(
      JSON.stringify({
        error: `There was an error unsubscribing ${sanitizedEmail}. Please try again later. Error: ${unsubscribeError.message}`,
      }),
      { status: 500 }
    )
  }

  // If there was an error sending the unsubscription email >> return an error
  if (unsubscribeEmailError?.message) {
    return new Response(
      JSON.stringify({
        error: `There was an error sending the unsubscription email to ${sanitizedEmail}. Please try again later. Error: ${unsubscribeEmailError.message}`,
      }),
      { status: 500 }
    )
  }

  // If unsubscription was successful >> redirect to the `/unsubscribed` page
  return redirect('/unsubscribed', 303)
}
