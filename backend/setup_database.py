"""
Database setup script for Blood-Sight application
Run this script to create the MySQL database and tables
"""

import mysql.connector
from mysql.connector import Error
import os
import getpass

# Database configuration
MYSQL_HOST = 'localhost'
MYSQL_PORT = 3306
MYSQL_USER = 'root'
DATABASE_NAME = 'blood_sight'

def get_mysql_password():
    """Get MySQL password from user"""
    password = getpass.getpass("Enter your MySQL root password: ")
    return password

def create_database():
    """Create the blood_sight database if it doesn't exist"""
    password = get_mysql_password()
    connection = None
    
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=password
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if it doesn't exist
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DATABASE_NAME}")
            print(f"✅ Database '{DATABASE_NAME}' created successfully!")
            
            # Show databases to confirm
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("Available databases:")
            for db in databases:
                print(f"  - {db[0]}")
            
            return password  # Return password for testing connection
                
    except Error as e:
        print(f"❌ Error connecting to MySQL: {e}")
        print("\nPlease make sure:")
        print("1. MySQL server is running")
        print("2. You entered the correct MySQL root password")
        print("3. You have permission to create databases")
        return None
        
    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

def test_connection(password):
    """Test connection to the created database"""
    connection = None
    try:
        connection = mysql.connector.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=password,
            database=DATABASE_NAME
        )
        
        if connection.is_connected():
            print(f"✅ Successfully connected to {DATABASE_NAME} database!")
            return True
            
    except Error as e:
        print(f"❌ Error connecting to database: {e}")
        return False
        
    finally:
        if connection and connection.is_connected():
            connection.close()

def update_config_file(password):
    """Update the config.py file with the correct password"""
    config_path = 'config.py'
    
    try:
        with open(config_path, 'r') as file:
            content = file.read()
        
        # Replace the password line
        updated_content = content.replace(
            "MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '')",
            f"MYSQL_PASSWORD = os.environ.get('MYSQL_PASSWORD', '{password}')"
        )
        
        with open(config_path, 'w') as file:
            file.write(updated_content)
        
        print(f"✅ Updated config.py with MySQL password")
        
    except Exception as e:
        print(f"⚠️  Could not update config.py: {e}")
        print(f"Please manually update MYSQL_PASSWORD in config.py to: '{password}'")

if __name__ == "__main__":
    print("Setting up Blood-Sight Database...")
    print("=" * 50)
    
    # Step 1: Create database
    password = create_database()
    
    if password:
        # Step 2: Test connection
        if test_connection(password):
            # Step 3: Update config file
            update_config_file(password)
            
            print("\n🎉 Database setup completed successfully!")
            print("\nNext steps:")
            print("1. Run 'python app.py' to create tables and start the server")
            print("2. The backend will be available at http://localhost:5001")
            print("3. Test user registration at http://localhost:3000/signup")
        else:
            print("\n❌ Database setup failed!")
    else:
        print("\n❌ Database setup failed!")
        print("Please check your MySQL installation and credentials.")
