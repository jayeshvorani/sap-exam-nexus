
import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { EmailVerificationTemplate } from './_templates/email-verification.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const wh = new Webhook(hookSecret)
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type, site_url },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
        site_url: string
      }
    }

    console.log('Sending verification email to:', user.email)
    console.log('Original redirect_to:', redirect_to)
    console.log('Original site_url:', site_url)

    // Always use production URLs, never localhost
    const deployedUrl = 'https://mqycxtydeqhwvdsjuuwo.supabase.co'
    const productionAppUrl = 'https://exquisite-macaroon-b1d3cb.lovable.app/email-verified'
    
    // Always override with production URL - never use localhost
    const finalRedirectUrl = productionAppUrl
    
    const verificationUrl = `${deployedUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(finalRedirectUrl)}`

    console.log('Final verification URL:', verificationUrl)

    const html = await renderAsync(
      React.createElement(EmailVerificationTemplate, {
        supabase_url: deployedUrl,
        token,
        token_hash,
        redirect_to: finalRedirectUrl,
        email_action_type,
        user_email: user.email,
        verification_url: verificationUrl,
      })
    )

    const { error } = await resend.emails.send({
      from: 'ExamPro <noreply@exampro.com>',
      to: [user.email],
      subject: 'Verify your email address - ExamPro',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Verification email sent successfully to:', user.email)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error) {
    console.error('Error in send-verification-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
