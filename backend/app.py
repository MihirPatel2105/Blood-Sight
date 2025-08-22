import os
import re
import random
import string
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename
import PyPDF2
import pdfplumber
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from datetime import datetime, timedelta

# Import database components
from config import Config
from models import db, User, BloodReport, BloodValue, PasswordResetToken

# Config
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)  # Enable CORS for all routes

# Initialize database and mail
db.init_app(app)
mail = Mail(app)

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# Helper functions for OTP and email
def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))


def send_otp_email(email, otp, name="User"):
    """Send OTP via email"""
    try:
        msg = Message(
            subject='Password Reset OTP - BloodAI',
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[email]
        )
        
        msg.html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #2563eb;">BloodAI</h1>
                </div>
                
                <h2 style="color: #1f2937;">Password Reset Request</h2>
                
                <p>Hello {name},</p>
                
                <p>You have requested to reset your password for your BloodAI account. Please use the following OTP to verify your identity:</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
                    <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">{otp}</h1>
                </div>
                
                <p><strong>This OTP is valid for 10 minutes only.</strong></p>
                
                <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
                    <p>Best regards,<br>The BloodAI Team</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False


# Helper: check allowed files
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Helper: validate email format
def validate_email(email):
    """Validate email format including college domains"""
    import re
    
    # Basic email regex pattern
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    
    if not re.match(email_pattern, email):
        return False
    
    # Allow specific college domains and common email providers
    allowed_domains = [
        'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
        'charusat.edu.in', 'charusat.ac.in',  # Charusat University
        'edu.in', 'ac.in',  # General Indian educational domains
        'student.charusat.edu.in'  # Student specific domain
    ]
    
    domain = email.split('@')[1].lower()
    
    # Check if domain is in allowed list or ends with educational domains
    if domain in allowed_domains or domain.endswith('.edu') or domain.endswith('.edu.in') or domain.endswith('.ac.in'):
        return True
    
    return True  # Allow all domains for now, you can restrict this later


@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Backend server is running", "port": 5001})


# Extract text from normal PDF
def extract_text_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text.strip()


# Extract text from scanned PDF (OCR)
def extract_text_ocr(path):
    text = ""
    pages = convert_from_path(path)  # convert PDF → images
    for page in pages:
        text += pytesseract.image_to_string(page)
    return text.strip()


# Analyze blood report text
def analyze_blood_report(text):
    """
    Extract blood test values and provide basic analysis
    """
    blood_values = []
    key_findings = []
    recommendations = []
    risk_level = "Low"
    
    # Common blood test patterns - improved for better extraction
    patterns = {
        'hemoglobin': r'(?:hemoglobin|hgb|hb)[\s:]*(\d+\.?\d*)',
        'wbc': r'(?:white blood cell|wbc|leucocyte|leukocyte)[\s:]*(\d+\.?\d*)',
        'rbc': r'(?:red blood cell|rbc|erythrocyte)[\s:]*(\d+\.?\d*)',
        'platelet': r'(?:platelet|plt)[\s:]*(\d+\.?\d*)',
        'hematocrit': r'(?:hematocrit|hct)[\s:]*(\d+\.?\d*)',
        'mcv': r'(?:mcv|mean corpuscular volume)[\s:]*(\d+\.?\d*)',
        'mch': r'(?:mch|mean corpuscular hemoglobin)[\s:]*(\d+\.?\d*)',
        'mchc': r'(?:mchc|mean corpuscular hemoglobin concentration)[\s:]*(\d+\.?\d*)',
        'glucose': r'(?:glucose|sugar|blood sugar)[\s:]*(\d+\.?\d*)',
        'cholesterol': r'(?:cholesterol|chol|total cholesterol)[\s:]*(\d+\.?\d*)',
        'hdl': r'(?:hdl|high density lipoprotein)[\s:]*(\d+\.?\d*)',
        'ldl': r'(?:ldl|low density lipoprotein)[\s:]*(\d+\.?\d*)',
        'triglycerides': r'(?:triglyceride|trig|triglycerides)[\s:]*(\d+\.?\d*)',
        'creatinine': r'(?:creatinine|crea)[\s:]*(\d+\.?\d*)',
        'urea': r'(?:urea|bun|blood urea nitrogen)[\s:]*(\d+\.?\d*)',
        'bilirubin': r'(?:bilirubin|bili|total bilirubin)[\s:]*(\d+\.?\d*)',
        'alt': r'(?:alt|alanine aminotransferase|sgpt)[\s:]*(\d+\.?\d*)',
        'ast': r'(?:ast|aspartate aminotransferase|sgot)[\s:]*(\d+\.?\d*)',
        'albumin': r'(?:albumin|alb)[\s:]*(\d+\.?\d*)',
        'protein': r'(?:total protein|protein)[\s:]*(\d+\.?\d*)'
    }
    
    text_lower = text.lower()
    
    # Extract values using regex
    for test_name, pattern in patterns.items():
        matches = re.findall(pattern, text_lower, re.IGNORECASE)
        if matches:
            try:
                value = float(matches[0])
                blood_values.append({
                    'name': test_name.title(),
                    'value': str(value),
                    'unit': get_unit_for_test(test_name),
                    'normalRange': get_normal_range(test_name),
                    'status': assess_value(test_name, value)
                })
            except ValueError:
                continue
    
    # Generate findings based on extracted values
    for value in blood_values:
        if value['status'] != 'normal':
            key_findings.append(f"{value['name']}: {value['value']} {value['unit']} ({value['status']})")
            
            if value['status'] in ['high', 'low']:
                risk_level = "Medium" if risk_level == "Low" else "High"
    
    # Generate recommendations
    if not key_findings:
        key_findings.append("All measured values appear to be within normal ranges")
        recommendations.append("Continue current lifestyle and regular check-ups")
    else:
        recommendations.append("Consult with your healthcare provider about abnormal values")
        recommendations.append("Consider lifestyle modifications if recommended by your doctor")
        recommendations.append("Schedule follow-up tests as advised")
    
    if risk_level == "High":
        recommendations.append("Urgent medical consultation recommended")
    
    return {
        'bloodValues': blood_values,
        'keyFindings': key_findings,
        'recommendations': recommendations,
        'riskLevel': risk_level,
        'overallHealth': f"Based on analysis: {risk_level} risk level detected"
    }


def get_unit_for_test(test_name):
    """Return appropriate unit for blood test"""
    units = {
        'hemoglobin': 'g/dL',
        'wbc': '×10³/μL',
        'rbc': '×10⁶/μL',
        'platelet': '×10³/μL',
        'hematocrit': '%',
        'mcv': 'fL',
        'mch': 'pg',
        'mchc': 'g/dL',
        'glucose': 'mg/dL',
        'cholesterol': 'mg/dL',
        'hdl': 'mg/dL',
        'ldl': 'mg/dL',
        'triglycerides': 'mg/dL',
        'creatinine': 'mg/dL',
        'urea': 'mg/dL',
        'bilirubin': 'mg/dL',
        'alt': 'U/L',
        'ast': 'U/L',
        'albumin': 'g/dL',
        'protein': 'g/dL'
    }
    return units.get(test_name, 'units')


def get_normal_range(test_name):
    """Return normal range for blood test"""
    ranges = {
        'hemoglobin': '12.0-15.5',
        'wbc': '4.5-11.0',
        'rbc': '4.2-5.9',
        'platelet': '150-450',
        'hematocrit': '36-46',
        'mcv': '80-100',
        'mch': '27-32',
        'mchc': '32-36',
        'glucose': '70-100',
        'cholesterol': '<200',
        'hdl': '>40',
        'ldl': '<100',
        'triglycerides': '<150',
        'creatinine': '0.6-1.2',
        'urea': '7-20',
        'bilirubin': '0.2-1.2',
        'alt': '7-40',
        'ast': '8-40',
        'albumin': '3.5-5.0',
        'protein': '6.0-8.3'
    }
    return ranges.get(test_name, 'N/A')
    return ranges.get(test_name, 'varies')


def assess_value(test_name, value):
    """Assess if value is normal, high, or low"""
    normal_ranges = {
        'hemoglobin': (12.0, 15.5),
        'wbc': (4.5, 11.0),
        'rbc': (4.2, 5.9),
        'platelet': (150, 450),
        'hematocrit': (36, 46),
        'mcv': (80, 100),
        'mch': (27, 32),
        'mchc': (32, 36),
        'glucose': (70, 100),
        'cholesterol': (0, 200),
        'hdl': (40, 999),  # HDL higher is better
        'ldl': (0, 100),
        'triglycerides': (0, 150),
        'creatinine': (0.6, 1.2),
        'urea': (7, 20),
        'bilirubin': (0.2, 1.2),
        'alt': (7, 40),
        'ast': (8, 40),
        'albumin': (3.5, 5.0),
        'protein': (6.0, 8.3)
    }
    
    if test_name in normal_ranges:
        min_val, max_val = normal_ranges[test_name]
        if value < min_val:
            return 'low'
        elif value > max_val:
            return 'high'
        else:
            return 'normal'
    
    return 'normal'


@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        extracted_text = ""

        try:
            if filename.lower().endswith(".pdf"):
                # Try extracting normally first
                text = extract_text_pdf(filepath)

                if text.strip() == "":
                    # If empty → scanned PDF → use OCR
                    extracted_text = extract_text_ocr(filepath)
                else:
                    extracted_text = text

            elif filename.lower().endswith(("png", "jpg", "jpeg")):
                extracted_text = pytesseract.image_to_string(Image.open(filepath))

            # Analyze the extracted text
            analysis = analyze_blood_report(extracted_text)
            
            return jsonify({
                "success": True,
                "filename": filename,
                "extracted_text": extracted_text[:1000] + "..." if len(extracted_text) > 1000 else extracted_text,
                "analysis": analysis
            })

        except Exception as e:
            return jsonify({
                "error": f"Error processing file: {str(e)}"
            }), 500

    return jsonify({"error": "File type not allowed"}), 400


@app.route("/signup", methods=["POST"])
def signup():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({"error": f"{field} is required"}), 400
        
        # Validate email format
        email = data['email'].lower().strip()
        if not validate_email(email):
            return jsonify({"error": "Please enter a valid email address"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User with this email already exists"}), 409
        
        # Create new user
        new_user = User(
            name=data['name'],
            email=email,
            phone=data.get('phone'),
            gender=data.get('gender')
        )
        
        # Handle date of birth if provided
        if data.get('dateOfBirth'):
            try:
                new_user.date_of_birth = datetime.strptime(data['dateOfBirth'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        
        # Set password
        new_user.set_password(data['password'])
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@app.route("/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400
        
        email = data['email'].lower().strip()
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Invalid email or password"}), 401
        
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    """Handle forgot password requests - Send OTP"""
    try:
        data = request.get_json()
        
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
        
        email = data['email'].lower().strip()
        
        # Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"error": "No account found with this email address"}), 404
        
        # Generate OTP
        otp = generate_otp()
        
        # Set expiration time (10 minutes from now)
        expires_at = datetime.utcnow() + timedelta(minutes=10)
        
        # Delete any existing unused tokens for this user
        PasswordResetToken.query.filter_by(user_id=user.id, is_used=False).delete()
        
        # Create new token
        reset_token = PasswordResetToken(
            user_id=user.id,
            email=email,
            otp=otp,
            expires_at=expires_at
        )
        
        db.session.add(reset_token)
        db.session.commit()
        
        # Send OTP via email
        if send_otp_email(email, otp, user.name):
            return jsonify({
                "success": True,
                "message": f"OTP has been sent to {email}. Please check your email."
            }), 200
        else:
            return jsonify({
                "error": "Failed to send OTP. Please try again later."
            }), 500
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    """Verify OTP for password reset"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').lower().strip()
        otp = data.get('otp', '').strip()
        
        if not email or not otp:
            return jsonify({"error": "Email and OTP are required"}), 400
        
        # Find the most recent unused token for this email
        token = PasswordResetToken.query.filter_by(
            email=email, 
            otp=otp, 
            is_used=False
        ).order_by(PasswordResetToken.created_at.desc()).first()
        
        if not token:
            return jsonify({"error": "Invalid OTP"}), 400
        
        if token.is_expired():
            return jsonify({"error": "OTP has expired. Please request a new one."}), 400
        
        return jsonify({
            "success": True,
            "message": "OTP verified successfully",
            "token_id": token.id
        }), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to verify OTP: {str(e)}"}), 500


@app.route("/reset-password", methods=["POST"])
def reset_password():
    """Reset password with verified OTP"""
    try:
        data = request.get_json()
        
        email = data.get('email', '').lower().strip()
        otp = data.get('otp', '').strip()
        new_password = data.get('new_password', '')
        confirm_password = data.get('confirm_password', '')
        
        if not all([email, otp, new_password, confirm_password]):
            return jsonify({"error": "All fields are required"}), 400
        
        if new_password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        if len(new_password) < 6:
            return jsonify({"error": "Password must be at least 6 characters long"}), 400
        
        # Find the token
        token = PasswordResetToken.query.filter_by(
            email=email, 
            otp=otp, 
            is_used=False
        ).order_by(PasswordResetToken.created_at.desc()).first()
        
        if not token:
            return jsonify({"error": "Invalid OTP"}), 400
        
        if token.is_expired():
            return jsonify({"error": "OTP has expired. Please request a new one."}), 400
        
        # Find the user
        user = User.query.get(token.user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        # Update password
        user.set_password(new_password)
        
        # Mark token as used
        token.is_used = True
        
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Password reset successfully"
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to reset password: {str(e)}"}), 500


@app.route("/users", methods=["GET"])
def get_users():
    """Get all users (for testing)"""
    try:
        users = User.query.all()
        return jsonify({
            "success": True,
            "users": [user.to_dict() for user in users]
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch users: {str(e)}"}), 500


if __name__ == "__main__":
    # Create tables if they don't exist
    with app.app_context():
        try:
            db.create_all()
            print("Database tables created successfully!")
        except Exception as e:
            print(f"Error creating database tables: {e}")
    
    app.run(debug=True, port=5001)
