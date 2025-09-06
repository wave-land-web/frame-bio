import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'

interface UserContactNotificationProps {
  firstName: string
}

export default function UserContactNotification({ firstName }: UserContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for contacting Frame Bio, {firstName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Frame Bio</Heading>

          <Hr style={hr} />

          <Section style={container}>
            <Text style={paragraph}>Hi {firstName},</Text>

            <Text style={paragraph}>
              Thank you for reaching out to Frame Bio! We've received your message and will get back
              to you as soon as possible.
            </Text>

            <Text style={paragraph}>
              In the meantime, feel free to{' '}
              <Link href={`${SITE_URL}`} style={link}>
                explore our website
              </Link>{' '}
            </Text>

            <Text style={paragraph}>We look forward to connecting with you soon!</Text>

            <Text style={paragraph}>
              Warm regards,
              <br />
              The Frame Bio Team
            </Text>

            <Section>
              <Button style={button} href={`${SITE_URL}`} target="_blank">
                Visit Our Website
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>Frame Bio LLC</Text>
          <Text style={footer}>
            7 Avenida Vista Grande, STE B7 PMB 468
            <br />
            Santa Fe, NM 87508
            <br />
            USA
          </Text>
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
}

const heading = {
  fontSize: '24px',
  lineHeight: '28px',
  fontWeight: 'bold',
  color: '#1a1a1a',
  marginBottom: '20px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
}

const button = {
  backgroundColor: '#e05136',
  borderRadius: '25px',
  color: '#ffffff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px',
}

const link = {
  color: '#e05136',
  textDecoration: 'none',
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
