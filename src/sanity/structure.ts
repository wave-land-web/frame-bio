import { BookIcon, ClipboardIcon, FolderIcon, UserIcon } from '@sanity/icons'

export const structure = (S: any) => {
  return S.list()
    .title('Sanity Studio')
    .items([
      // TODO: Pages at top level
      // S.listItem()
      //   .title('Pages')
      //   .icon(FolderIcon)
      //   .child(
      //     S.list()
      //       .title('Pages')
      //       .items([
      //         S.listItem()
      //           .title('Home')
      //           .icon(ClipboardIcon)
      //           .child(S.documentTypeList('home').title('Home Page')),
      //         S.listItem()
      //           .title('Blog')
      //           .icon(ClipboardIcon)
      //           .child(S.documentTypeList('blog').title('Blog Page')),
      //       ])
      //   ),

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
