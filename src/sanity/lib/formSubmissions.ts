// Types for form submissions matching the exact Sanity schema structures

export interface UserData {
  firstName: string
  lastName: string
  businessName: string
  jobTitle: string
  emailAddress: string
  phoneNumber: string
}

export interface ContactFormData {
  // User data - will be extracted to create/update user record
  firstName: string
  lastName: string
  businessName: string
  jobTitle: string
  emailAddress: string
  phoneNumber: string
  messageBody?: string
}

// Utility functions for creating/updating users and form submissions

/**
 * Create or update a user in Sanity
 */
export async function createOrUpdateUser(client: any, userData: UserData): Promise<string> {
  // Check if user already exists by email
  const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, {
    email: userData.emailAddress,
  })

  if (existingUser) {
    // Update existing user
    const updatedUser = await client
      .patch(existingUser._id)
      .set({
        firstName: userData.firstName,
        lastName: userData.lastName,
        businessName: userData.businessName || existingUser.businessName,
        jobTitle: userData.jobTitle || existingUser.jobTitle,
        email: userData.emailAddress || existingUser.emailAddress,
        phone: userData.phoneNumber || existingUser.phone,
      })
      .commit()

    return updatedUser._id
  } else {
    // Create new user
    const newUser = await client.create({
      _type: 'user',
      firstName: userData.firstName,
      lastName: userData.lastName,
      businessName: userData.businessName,
      jobTitle: userData.jobTitle,
      email: userData.emailAddress,
      phone: userData.phoneNumber,
    })

    return newUser._id
  }
}

/**
 * Create a contact form submission
 */
export async function createContactFormSubmission(
  client: any,
  formData: ContactFormData
): Promise<any> {
  // Create or update user first - map contact form fields to user data
  const userData: UserData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    businessName: formData.businessName,
    jobTitle: formData.jobTitle,
    emailAddress: formData.emailAddress, // contactForm uses emailAddress field
    phoneNumber: formData.phoneNumber, // contactForm uses phoneNumber field
  }

  const userId = await createOrUpdateUser(client, userData)

  // Create contact form submission with exact schema structure
  const submission = await client.create({
    _type: 'contactForm',
    user: {
      _type: 'reference',
      _ref: userId,
    },
    submittedAt: new Date().toISOString(),
    messageBody: formData.messageBody,
    status: 'new',
  })

  return submission
}
