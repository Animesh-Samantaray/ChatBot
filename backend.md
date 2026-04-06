# QuickGPT Backend API Documentation

## Overview
QuickGPT backend API built with Express.js, featuring user authentication, chat management, and AI message processing.

## Base URL
- Production: `https://chatbot-backend-9y4z.onrender.com`
- Development: `http://localhost:3000`

## CORS Configuration
- Credentials: `true` (allows cookies)
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Allowed Origins:
  - `https://chatbot-frontend-url.onrender.com` (production)
  - `http://localhost:5173` (development)
  - `http://localhost:3000` (development)

## API Routes

### 1. User Routes (`/api/user` & `/user`)

#### POST `/api/user/signup` - User Registration
- **Description**: Register a new user
- **Authentication**: None
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Sign up successful",
  "user": {
    "name": "string",
    "email": "string",
    "_id": "string",
    "createdAt": "string"
  },
  "token": "jwt_token_string"
}
```
- **Cookie**: Sets `token` cookie (httpOnly, 7 days)

#### POST `/api/user/login` - User Login
- **Description**: Authenticate user and set session
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Logged in successfully",
  "user": {
    "name": "string",
    "email": "string",
    "_id": "string"
  },
  "token": "jwt_token_string"
}
```
- **Cookie**: Sets `token` cookie (httpOnly, 7 days)

#### POST `/api/user/logout` - User Logout
- **Description**: Clear user session
- **Authentication**: Required (JWT)
- **Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
- **Cookie**: Clears `token` cookie

#### GET `/api/user/data` - Get User Data
- **Description**: Fetch current user information
- **Authentication**: Required (JWT)
- **Response**:
```json
{
  "success": true,
  "user": {
    "name": "string",
    "email": "string",
    "_id": "string",
    "createdAt": "string"
  }
}
```

### 2. Chat Routes (`/api/chat` & `/chat`)

#### GET `/api/chat/create` - Create New Chat
- **Description**: Create a new chat session
- **Authentication**: Required (JWT)
- **Response**:
```json
{
  "success": true,
  "chat": {
    "_id": "string",
    "userId": "string",
    "messages": [],
    "createdAt": "string"
  }
}
```

#### GET `/api/chat/get` - Get User Chats
- **Description**: Fetch all chats for current user
- **Authentication**: Required (JWT)
- **Response**:
```json
{
  "success": true,
  "chats": [
    {
      "_id": "string",
      "userId": "string",
      "messages": [
        {
          "role": "user|assistant",
          "content": "string",
          "timestamp": "number"
        }
      ],
      "createdAt": "string"
    }
  ]
}
```

#### POST `/api/chat/delete` - Delete Chat
- **Description**: Delete a specific chat
- **Authentication**: Required (JWT)
- **Request Body**:
```json
{
  "chatId": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### 3. Message Routes (`/api/message` & `/message`)

#### POST `/api/message/text` - Send Text Message
- **Description**: Send a text message to AI
- **Authentication**: Required (JWT)
- **Request Body**:
```json
{
  "chatId": "string",
  "prompt": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "reply": {
    "role": "assistant",
    "content": "string",
    "timestamp": "number",
    "isImage": false
  }
}
```

#### POST `/api/message/image` - Generate Image
- **Description**: Generate an AI image from text prompt
- **Authentication**: Required (JWT)
- **Request Body**:
```json
{
  "chatId": "string",
  "prompt": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "reply": {
    "role": "assistant",
    "content": "image_url_string",
    "timestamp": "number",
    "isImage": true
  }
}
```

## Authentication

### JWT Token
- **Algorithm**: HS256
- **Secret**: `process.env.JWT_SECRET`
- **Expiration**: 7 days
- **Payload**: `{ id: userId }`

### Cookie Configuration
```javascript
// Current Issue - Missing sameSite and secure settings
res.cookie('token', token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 
});

// Should be:
res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 
});
```

## Environment Variables
- `NODE_ENV`: Development/Production
- `PORT`: Server port (default: 3000)
- `MONGODB_URL`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `OPENAI_API_KEY`: OpenAI API key for AI responses
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public key
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private key
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint

## Error Handling
All endpoints return consistent error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Frontend Integration Notes

### Current Issues:
1. **Cookie Configuration**: Missing `sameSite: 'none'` and `secure: true`
2. **CORS**: Properly configured but needs frontend to match origins
3. **Route Compatibility**: Both `/api` and non-`/api` versions available

### Required Frontend Changes:
1. Update axios configuration to handle cookies properly
2. Ensure all API calls use correct endpoints
3. Handle authentication state management
4. Implement proper error handling

### Deployment Considerations:
- Frontend and Backend on different domains require `sameSite: 'none'`
- `secure: true` required for HTTPS environments
- CORS origins must match deployed frontend URL
