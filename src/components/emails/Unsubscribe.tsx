import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { SITE_URL } from '../../consts'
import { capitalize } from '../../lib/text'
interface UnsubscribeProps {
  firstName: string
}

export default function Unsubscribe({ firstName }: UnsubscribeProps) {
  const firstNameCapitalized = capitalize(firstName)

  return (
    <Html>
      <Head />
      <Preview>
        {firstNameCapitalized}, you have been unsubscribed from Frame Bio. You will no longer
        receive any emails from us.
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${SITE_URL}/jtbi-logo-primary-90-opacity.png`}
            width="320"
            height="auto"
            alt="Frame Bio Logo"
            style={logo}
          />

          <Hr style={hr} />

          <Section style={container}>
            <Text style={paragraph}>
              Hi {firstNameCapitalized}, you have been unsubscribed from Frame Bio. You will no
              longer receive any emails from us.
            </Text>
            <Text style={paragraph}>Come back anytime!</Text>

            <Section>
              <Button style={button} href={`${SITE_URL}`} target="_blank">
                Back to Frame Bio
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

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

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
}
