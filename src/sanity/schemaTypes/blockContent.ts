import { defineArrayMember, defineType } from 'sanity'

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'H5', value: 'h5' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike Through', value: 'strike-through' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('Please add an image'),
      fields: [
        {
          type: 'string',
          name: 'alt',
          title: 'Alt text',
          description: `Please add a brief description of your image to help people with visual impairments understand the meaning of the image`,
          validation: (Rule) => Rule.required().error('Please add alternative text'),
        },
        {
          type: 'string',
          name: 'caption',
          title: 'Caption (optional)',
        },
      ],
    }),
  ],
})
