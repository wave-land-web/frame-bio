import { EnvelopeIcon, FolderIcon, UserIcon } from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('Sanity Studio')
    .items([
      // Forms at top level
      S.listItem()
        .title('Forms')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Forms')
            .items([
              S.listItem()
                .title('Contact Form')
                .icon(EnvelopeIcon)
                .child(S.documentTypeList('contactForm').title('Contact Form Submissions')),
            ])
        ),

      // People at top level
      S.listItem()
        .title('People')
        .icon(UserIcon)
        .child(
          S.list()
            .title('People')
            .items([
              S.listItem()
                .title('Users')
                .icon(UserIcon)
                .child(S.documentTypeList('user').title('Users')),
            ])
        ),
    ])
}
