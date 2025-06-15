
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface EmailVerificationProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const EmailVerificationTemplate = ({
  token_hash,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address to complete your registration</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <div style={logo}>
            📚 ExamPro
          </div>
        </Section>
        
        <Heading style={h1}>Verify Your Email Address</Heading>
        
        <Text style={text}>
          Welcome to ExamPro! We're excited to have you join our platform.
        </Text>
        
        <Text style={text}>
          To complete your registration and secure your account, please verify your email address by clicking the button below:
        </Text>
        
        <Section style={buttonContainer}>
          <Button
            style={button}
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
          >
            Verify Email Address
          </Button>
        </Section>
        
        <Text style={text}>
          This verification link will expire in 24 hours for security purposes.
        </Text>
        
        <Hr style={hr} />
        
        <Text style={smallText}>
          If the button above doesn't work, you can copy and paste this link into your browser:
        </Text>
        
        <Text style={linkText}>
          {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
        </Text>
        
        <Hr style={hr} />
        
        <Text style={footer}>
          If you didn't create an account with ExamPro, you can safely ignore this email.
        </Text>
        
        <Text style={footer}>
          For support, contact us at support@exampro.com
        </Text>
        
        <Text style={footer}>
          © 2024 ExamPro. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailVerificationTemplate

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
}

const logoSection = {
  padding: '32px 40px 0',
  textAlign: 'center' as const,
}

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '16px',
}

const h1 = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 40px 20px',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 40px',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
  border: 'none',
  cursor: 'pointer',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 40px',
}

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 40px 8px',
}

const linkText = {
  color: '#3b82f6',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 40px 16px',
  wordBreak: 'break-all' as const,
  padding: '12px',
  backgroundColor: '#f3f4f6',
  borderRadius: '6px',
  fontFamily: 'monospace',
}

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '8px 40px',
  textAlign: 'center' as const,
}
