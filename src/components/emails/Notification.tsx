import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'
import { capitalize } from '../../lib/text'

interface NotificationProps {
  firstName: string
  lastName: string
  businessName: string
  email: string
  phone: string
  message?: string
  isSubscribed: boolean
}

export default function Notification({
  firstName,
  lastName,
  businessName,
  email,
  phone,
  message,
  isSubscribed,
}: NotificationProps) {
  const fullName = `${capitalize(firstName)} ${capitalize(lastName)}`
  const subscriptionStatus = isSubscribed ? 'subscribed to newsletter' : 'did not subscribe'

  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {fullName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={container}>
            <Text style={heading}>New Contact Form Submission</Text>

            <Text style={paragraph}>
              Someone has sent you a message through your website contact form!
            </Text>

            <Hr style={hr} />

            <Text style={subheading}>Contact Details:</Text>
            <Text style={paragraph}>
              <strong>Name:</strong> {fullName}
              <br />
              <strong>Business:</strong> {businessName}
              <br />
              <strong>Email:</strong> {email}
              <br />
              <strong>Phone:</strong> {phone}
              <br />
              <strong>Newsletter:</strong> {subscriptionStatus}
            </Text>

            {message && (
              <>
                <Text style={subheading}>Message:</Text>
                <Text style={messageBox}>{message}</Text>
              </>
            )}

            <Hr style={hr} />

            <Section style={buttonContainer}>
              <Button style={button} href={`${SITE_URL}/admin`} target="_blank">
                View in CMS
              </Button>
            </Section>

            <Text style={footer}>
              This notification was sent from your Frame Bio website contact form.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const heading = {
  fontSize: '24px',
  lineHeight: '28px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: '20px',
}

const subheading = {
  fontSize: '18px',
  lineHeight: '22px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginTop: '20px',
  marginBottom: '10px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#1a1a1a',
}

const messageBox = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a1a',
  backgroundColor: '#f8f9fa',
  padding: '16px',
  borderRadius: '8px',
  border: '1px solid #e9ecef',
  marginTop: '10px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const button = {
  backgroundColor: '#2b86a5',
  borderRadius: '25px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '30px',
}
