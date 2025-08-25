import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'
import { capitalize } from '../../lib/text'

interface WelcomeProps {
  email: string
  firstName: string
  isSubscribed?: boolean
}

export default function Welcome({ email, firstName, isSubscribed = true }: WelcomeProps) {
  const firstNameCapitalized = capitalize(firstName)

  return (
    <Html>
      <Head />
      <Preview>
        {isSubscribed
          ? `Welcome to Frame Bio, ${firstNameCapitalized}`
          : `Thank you for contacting Frame Bio, ${firstNameCapitalized}`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Hr style={hr} />

          <Section style={container}>
            <Text style={paragraph}>Hi {firstNameCapitalized},</Text>

            <Text style={paragraph}>
              {isSubscribed
                ? 'Thank you for subscribing to Frame Bio'
                : 'Thank you for contacting Frame Bio'}
            </Text>

            <Text style={paragraph}>
              {isSubscribed
                ? "We've received your information and will get back to you shortly. You've also been added to our mailing list. We limit our emails to only a few a year, and we never sell your information to others. If you ever find that these emails no longer fit your fancy, you can unsubscribe anytime."
                : "We've received your information and will get back to you shortly. Feel free to submit again with a checked box at anytime to subscribe for updates."}
            </Text>

            <Text style={paragraph}>
              Sincerely,
              <br />
              The Frame Bio Team
            </Text>

            <Section>
              <Button style={button} href={`${SITE_URL}`} target="_blank">
                Learn More
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          {isSubscribed && (
            <Link style={link} href={`${SITE_URL}/api/forms/unsubscribe/${email}`} target="_blank">
              unsubscribe
            </Link>
          )}

          <Text style={footer}>Frame Bio</Text>
          <Text style={footer}>
            PO Box 634
            <br />
            Chimacum, WA 98325
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

const logo = {
  margin: '0 auto',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
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

const link = {
  color: '#2b86a5',
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
