from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    gender = db.Column(db.String(10), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with blood reports
    blood_reports = db.relationship('BloodReport', backref='user', lazy=True)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class BloodReport(db.Model):
    __tablename__ = 'blood_reports'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    extracted_text = db.Column(db.Text, nullable=True)
    analysis_result = db.Column(db.JSON, nullable=True)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    analysis_date = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        """Convert blood report object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'extracted_text': self.extracted_text,
            'analysis_result': self.analysis_result,
            'upload_date': self.upload_date.isoformat(),
            'analysis_date': self.analysis_date.isoformat() if self.analysis_date else None
        }

class BloodValue(db.Model):
    __tablename__ = 'blood_values'
    
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('blood_reports.id'), nullable=False)
    parameter_name = db.Column(db.String(100), nullable=False)
    value = db.Column(db.String(50), nullable=False)
    unit = db.Column(db.String(20), nullable=False)
    normal_range = db.Column(db.String(50), nullable=False)
    status = db.Column(db.Enum('normal', 'high', 'low'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert blood value object to dictionary"""
        return {
            'id': self.id,
            'report_id': self.report_id,
            'parameter_name': self.parameter_name,
            'value': self.value,
            'unit': self.unit,
            'normal_range': self.normal_range,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    
    def is_expired(self):
        """Check if the OTP token has expired"""
        return datetime.utcnow() > self.expires_at
    
    def to_dict(self):
        """Convert token object to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'email': self.email,
            'is_used': self.is_used,
            'created_at': self.created_at.isoformat(),
            'expires_at': self.expires_at.isoformat()
        }
