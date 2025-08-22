# Blood-Sight Backend Setup

## Prerequisites

1. **MySQL Server**: Make sure MySQL is installed and running on your Mac
   - You can download from: https://dev.mysql.com/downloads/mysql/
   - Or install via Homebrew: `brew install mysql`

2. **Python Virtual Environment**: The `.bsa` virtual environment should be activated

## Database Setup

1. **Run the database setup script**:
   ```bash
   cd backend
   python setup_database.py
   ```
   
2. **Enter your MySQL root password** when prompted

3. The script will:
   - Create the `blood_sight` database
   - Update `config.py` with your password
   - Test the connection

## Start the Backend Server

```bash
python app.py
```

The server will:
- Create all necessary database tables
- Start on http://localhost:5001

## API Endpoints

- `POST /signup` - User registration
- `POST /login` - User login  
- `POST /upload` - Upload and analyze blood reports
- `GET /users` - List all users (for testing)

## Test the Integration

1. Start the backend: `python app.py`
2. Start the frontend: `npm run dev` (in frontend directory)
3. Visit http://localhost:3000/signup to test user registration
4. Visit http://localhost:3000/analysis to test blood report upload

## Database Tables

The application creates these tables:
- `users` - User accounts with encrypted passwords
- `blood_reports` - Uploaded files and analysis results
- `blood_values` - Extracted blood test parameters

## Troubleshooting

- **MySQL Connection Issues**: Check that MySQL is running and credentials are correct
- **Port 5001 in use**: Kill the process with `lsof -ti:5001 | xargs kill -9`
- **Permission errors**: Make sure your MySQL user has database creation privileges
