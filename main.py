import os
import logging
import boto3
from botocore.exceptions import ClientError
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for
from flask_cors import CORS
from flask_mail import Mail, Message

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
CORS(app)  # Enable CORS for all routes

# Configure email settings
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'email-smtp.us-east-1.amazonaws.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@cybersafe.example.com')
app.config['COMPANY_EMAIL'] = os.environ.get('COMPANY_EMAIL', 'info@cybersafe.example.com')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit-demo', methods=['POST'])
def submit_demo():
    if request.method == 'POST':
        # For JSON requests from Flutter
        if request.is_json:
            data = request.get_json()
            name = data.get('name')
            company = data.get('company')
            email = data.get('email')
            reason = data.get('reason')
            contact_preference = data.get('contact_preference')
            
            # Log form submission
            app.logger.info(f"Demo request from {name} at {company}")
            
            # Send email with AWS SES
            try:
                send_email_notification(name, company, email, reason, contact_preference)
                app.logger.info(f"Email notification sent for {name} at {company}")
            except Exception as e:
                app.logger.error(f"Error sending email: {str(e)}")
            
            # Return JSON response for API clients
            return jsonify({
                'success': True,
                'message': 'Your demo request has been submitted successfully! We will contact you soon.'
            })
        
        # For traditional form submissions
        else:
            name = request.form.get('name')
            company = request.form.get('company')
            email = request.form.get('email')
            reason = request.form.get('reason')
            contact_preference = request.form.get('contact_preference')
            
            # Log form submission
            app.logger.info(f"Demo request from {name} at {company}")
            
            # Send email with AWS SES
            try:
                send_email_notification(name, company, email, reason, contact_preference)
                app.logger.info(f"Email notification sent for {name} at {company}")
            except Exception as e:
                app.logger.error(f"Error sending email: {str(e)}")
            
            # Flash a success message
            flash('Your demo request has been submitted successfully! We will contact you soon.', 'success')
            
            return redirect(url_for('index', _anchor='request-demo'))
    
    return redirect(url_for('index'))

def send_email_notification(name, company, email, reason, contact_preference):
    """Send email notification about new demo request using AWS SES via Flask-Mail"""
    reason_map = {
        'risk-assessment': 'AI Risk Assessment',
        'insurance-coverage': 'Cyber Insurance Coverage',
        'threat-intelligence': 'Threat Intelligence',
        'compliance': 'Compliance Management',
        'other': 'Other'
    }
    
    reason_text = reason_map.get(reason, reason)
    
    subject = f"New Demo Request: {company}"
    
    body = f"""
    New demo request from CyberSafe website:
    
    Name: {name}
    Company: {company}
    Email: {email}
    Primary Interest: {reason_text}
    Preferred Contact Method: {contact_preference}
    
    Please follow up with this lead.
    """
    
    recipients = [app.config['COMPANY_EMAIL']]
    
    msg = Message(
        subject=subject,
        recipients=recipients,
        body=body,
        sender=app.config['MAIL_DEFAULT_SENDER']
    )
    
    mail.send(msg)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
