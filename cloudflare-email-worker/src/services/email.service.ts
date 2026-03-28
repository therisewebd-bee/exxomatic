import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';
import { templates } from '../templates';

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    fromName: string;
}

interface EmailJobData {
    to: string;
    subject: string;
    templateName: string;
    templateData: any;
}

class EmailService {
    private transporter: any = null;
    private config: EmailConfig | null = null;

    initialize(config: EmailConfig) {
        this.config = config;
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.auth,
            // Add timeouts to prevent worker hanging
            connectionTimeout: 10000, // 10 seconds
            socketTimeout: 10000,     // 10 seconds
        });

        // Register helpers
        Handlebars.registerHelper('formatDate', function (date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        });

        Handlebars.registerHelper('formatCurrency', function (amount) {
            if (amount === undefined || amount === null) return '';
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'INR',
            }).format(amount);
        });
    }

    async verifyConnection() {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }
        return this.transporter.verify();
    }

    async sendEmail(data: EmailJobData) {
        try {
            if (!this.config) {
                throw new Error('Email service not initialized');
            }

            // Get precompiled template spec
            const templateSpec = templates[data.templateName as keyof typeof templates];
            if (!templateSpec) {
                throw new Error(`Template ${data.templateName} not found`);
            }

            // Hydrate the template
            const template = Handlebars.template(templateSpec);

            // Render html
            const html = template(data.templateData);

            // Prepare email options
            const mailOptions = {
                from: `"${this.config.fromName}" <${this.config.auth.user}>`,
                to: data.to,
                subject: data.subject,
                html: html,
            };

            // Fallback / Default: SMTP
            if (!this.transporter) {
                throw new Error('SMTP transporter not initialized');
            }
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${data.to} via SMTP`);

        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export const emailService = new EmailService();
