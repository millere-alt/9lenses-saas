import { EmailClient } from '@azure/communication-email';

/**
 * Email Service using Azure Communication Services
 * Supports both production (real emails) and development (mock mode)
 */
class EmailService {
  constructor() {
    this.connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
    this.senderAddress = process.env.AZURE_COMMUNICATION_SENDER_EMAIL || 'noreply@9vectors.com';

    // Use mock mode only if connection string is missing OR explicitly disabled
    // Set AZURE_EMAIL_ENABLED=false to force mock mode even with connection string
    const emailEnabled = process.env.AZURE_EMAIL_ENABLED !== 'false';
    this.mockMode = !this.connectionString || !emailEnabled;

    if (this.mockMode) {
      console.warn('EmailService running in MOCK MODE - no real emails will be sent');
      console.warn(`Reason: ${!this.connectionString ? 'No connection string' : 'AZURE_EMAIL_ENABLED=false'}`);
      this.client = null;
    } else {
      this.client = new EmailClient(this.connectionString);
      console.log('EmailService initialized with Azure Communication Services');
      console.log(`Sender address: ${this.senderAddress}`);
    }
  }

  /**
   * Send an email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.html - HTML content
   * @param {string} options.text - Plain text fallback
   * @returns {Promise<Object>} - Send result
   */
  async sendEmail({ to, subject, html, text }) {
    if (this.mockMode) {
      console.log('MOCK EMAIL SEND:', { to, subject, htmlLength: html?.length, textLength: text?.length });
      return {
        success: true,
        messageId: `mock-${Date.now()}`,
        mock: true
      };
    }

    try {
      const message = {
        senderAddress: this.senderAddress,
        content: {
          subject,
          html,
          plainText: text
        },
        recipients: {
          to: [{ address: to }]
        }
      };

      const poller = await this.client.beginSend(message);
      const result = await poller.pollUntilDone();

      console.log('Email sent successfully', { to, subject, messageId: result.id });

      return {
        success: true,
        messageId: result.id,
        mock: false
      };
    } catch (error) {
      console.error('Failed to send email', { to, subject, error: error.message });
      throw new Error(`Email send failed: ${error.message}`);
    }
  }

  /**
   * Send welcome email to new user
   * @param {Object} user - User object with email and name
   * @returns {Promise<Object>}
   */
  async sendWelcomeEmail(user) {
    const { email, firstName, lastName } = user;
    const name = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : email;

    const html = this.getWelcomeEmailTemplate(name);
    const text = this.getWelcomeEmailText(name);

    return this.sendEmail({
      to: email,
      subject: 'Welcome to 9Vectors',
      html,
      text
    });
  }

  /**
   * Send password reset email
   * @param {Object} user - User object with email
   * @param {string} resetToken - Password reset token
   * @returns {Promise<Object>}
   */
  async sendPasswordResetEmail(user, resetToken) {
    const { email, firstName, lastName } = user;
    const name = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'there';

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3005'}/reset-password?token=${resetToken}`;

    const html = this.getPasswordResetEmailTemplate(name, resetUrl);
    const text = this.getPasswordResetEmailText(name, resetUrl);

    return this.sendEmail({
      to: email,
      subject: 'Reset Your 9Vectors Password',
      html,
      text
    });
  }

  /**
   * Send password changed confirmation email
   * @param {Object} user - User object with email
   * @returns {Promise<Object>}
   */
  async sendPasswordChangedEmail(user) {
    const { email, firstName, lastName } = user;
    const name = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : 'there';

    const html = this.getPasswordChangedEmailTemplate(name);
    const text = this.getPasswordChangedEmailText(name);

    return this.sendEmail({
      to: email,
      subject: 'Your 9Vectors Password Has Been Changed',
      html,
      text
    });
  }

  /**
   * HTML template for welcome email
   */
  getWelcomeEmailTemplate(name) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to 9Vectors</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">9Vectors</h1>
              <p style="margin: 10px 0 0; color: #e0e7ff; font-size: 16px;">Organizational Assessment Platform</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome, ${name}!</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Thank you for joining 9Vectors. We're excited to have you on board!
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                9Vectors is a comprehensive platform for conducting organizational assessments using our proven framework that evaluates organizations across 9 interconnected business dimensions.
              </p>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                You can now log in and start creating assessments, inviting team members, and gaining valuable insights into your organization.
              </p>
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3005'}/login" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-align: center;">
                Need help? Contact us at <a href="mailto:support@9vectors.com" style="color: #667eea; text-decoration: none;">support@9vectors.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} 9Vectors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Plain text version of welcome email
   */
  getWelcomeEmailText(name) {
    return `
Welcome to 9Vectors, ${name}!

Thank you for joining 9Vectors. We're excited to have you on board!

9Vectors is a comprehensive platform for conducting organizational assessments using our proven framework that evaluates organizations across 9 interconnected business dimensions.

You can now log in and start creating assessments, inviting team members, and gaining valuable insights into your organization.

Get started: ${process.env.FRONTEND_URL || 'http://localhost:3005'}/login

Need help? Contact us at support@9vectors.com

© ${new Date().getFullYear()} 9Vectors. All rights reserved.
    `.trim();
  }

  /**
   * HTML template for password reset email
   */
  getPasswordResetEmailTemplate(name, resetUrl) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">9Vectors</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hi ${name},
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your 9Vectors account. Click the button below to create a new password:
              </p>
              <table role="presentation" style="margin: 24px auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 24px; padding: 12px; background-color: #f9fafb; border-radius: 4px; color: #6b7280; font-size: 12px; word-break: break-all;">
                ${resetUrl}
              </p>
              <p style="margin: 0 0 16px; color: #ef4444; font-size: 14px; line-height: 1.6; font-weight: 600;">
                This link will expire in 1 hour.
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-align: center;">
                Need help? Contact us at <a href="mailto:support@9vectors.com" style="color: #667eea; text-decoration: none;">support@9vectors.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} 9Vectors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Plain text version of password reset email
   */
  getPasswordResetEmailText(name, resetUrl) {
    return `
Reset Your Password

Hi ${name},

We received a request to reset your password for your 9Vectors account.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Need help? Contact us at support@9vectors.com

© ${new Date().getFullYear()} 9Vectors. All rights reserved.
    `.trim();
  }

  /**
   * HTML template for password changed confirmation email
   */
  getPasswordChangedEmailTemplate(name) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Changed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">9Vectors</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; position: relative;">
                  <svg style="width: 32px; height: 32px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" fill="none" stroke="#ffffff" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">Password Changed Successfully</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hi ${name},
              </p>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Your 9Vectors password has been successfully changed.
              </p>
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                If you made this change, no further action is needed.
              </p>
              <div style="padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Didn't change your password?</strong><br>
                  If you didn't make this change, please contact our support team immediately at <a href="mailto:support@9vectors.com" style="color: #92400e; text-decoration: underline;">support@9vectors.com</a>
                </p>
              </div>
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:3005'}/login" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Log In to 9Vectors
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-align: center;">
                Need help? Contact us at <a href="mailto:support@9vectors.com" style="color: #667eea; text-decoration: none;">support@9vectors.com</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} 9Vectors. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Plain text version of password changed email
   */
  getPasswordChangedEmailText(name) {
    return `
Password Changed Successfully

Hi ${name},

Your 9Vectors password has been successfully changed.

If you made this change, no further action is needed.

IMPORTANT: If you didn't change your password, please contact our support team immediately at support@9vectors.com

Log in to 9Vectors: ${process.env.FRONTEND_URL || 'http://localhost:3005'}/login

Need help? Contact us at support@9vectors.com

© ${new Date().getFullYear()} 9Vectors. All rights reserved.
    `.trim();
  }
}

// Singleton instance
const emailService = new EmailService();

export default emailService;
