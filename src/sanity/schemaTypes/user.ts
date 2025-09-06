import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      description: 'Required first name',
      validation: (Rule) => Rule.required().error('First name is required'),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      description: 'Required last name',
      validation: (Rule) => Rule.required().error('Last name is required'),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'email',
      description: 'Required email address',
      validation: (Rule) => Rule.required().error('A valid email address is required'),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'Required phone number',
      validation: (Rule) => Rule.required().error('Phone number is required'),
    }),
    defineField({
      name: 'businessName',
      title: 'Business Name',
      type: 'string',
      description: 'Required business or company name',
      validation: (Rule) => Rule.required().error('Business name is required'),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      description: 'Required job title or position',
      validation: (Rule) => Rule.required().error('Job title is required'),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      description: 'When the user was created',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      description: 'When the user was last updated',
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      businessName: 'businessName',
      jobTitle: 'jobTitle',
    },
    prepare(selection) {
      const { firstName, lastName, email, businessName, jobTitle } = selection
      const fullName = `${firstName || ''} ${lastName || ''}`.trim()
      const title = fullName || email || 'Unnamed User'

      // Build subtitle with business name and job title if available
      const businessInfo = []
      if (jobTitle) businessInfo.push(jobTitle)
      if (businessName) businessInfo.push(businessName)

      const subtitle =
        businessInfo.length > 0 ? businessInfo.join(' at ') : email && fullName ? email : ''

      // Use UserIcon for all users
      const media = UserIcon

      return {
        title,
        subtitle,
        media,
      }
    },
  },
})
