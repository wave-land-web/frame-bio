import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactForm',
  title: 'Contact Form Submission',
  type: 'document',
  fields: [
    // Track the user who submitted the form
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required().error('User reference is required'),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      description: 'When the form was submitted',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'messageBody',
      title: 'Message',
      type: 'text',
    }),

    // Administrative fields
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Responded', value: 'responded' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'blockContent',
      description: 'Internal notes for follow-up or response tracking',
    }),
  ],

  preview: {
    select: {
      userFirstName: 'user.firstName',
      userLastName: 'user.lastName',
      firstName: 'firstName',
      lastName: 'lastName',
      messageBody: 'messageBody',
      submittedAt: 'submittedAt',
      status: 'status',
    },
    prepare(selection) {
      const { userFirstName, userLastName, firstName, lastName, messageBody, submittedAt, status } =
        selection
      // Use user reference name first, then form firstName/lastName as fallback
      const userName =
        `${userFirstName || ''} ${userLastName || ''}`.trim() ||
        `${firstName || ''} ${lastName || ''}`.trim() ||
        'Unknown User'
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString() : 'Unknown Date'
      const preview = messageBody
        ? messageBody.substring(0, 50) + (messageBody.length > 50 ? '...' : '')
        : 'No message'

      const statusEmoji: Record<string, string> = {
        new: '🆕',
        'in-progress': '🔄',
        responded: '✅',
        closed: '🔒',
      }

      return {
        title: `${statusEmoji[status] || '📧'} Contact - ${userName}`,
        subtitle: `${date} - ${preview}`,
        media: EnvelopeIcon,
      }
    },
  },
})
