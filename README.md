# Java-springboot-sms-otp

## HOW TO RUN

- **Backend**

```bash
./mvnw spring-boot:run
```

- **Client-side (React.js)**

what you need to do:

```bash
cd firebase-phone-auth-app_client

# install semua library yang dibutuhkan
npm install

# install package firebase
npm install firebase

npm start
```

kalau mau buat proyek sendiri dari nol :

```bash
# inisiasi proyek react.js
npx create-react-app firebase-phone-auth_client
cd firebase-phone-auth-app_client

# install semua library yang dibutuhkan
npm install

# install package firebase
npm install firebase

# ubah src/firebaseConfig.js, src/App.js, src/PhoneAuth.js

npm start
```

## SMS OTP Flow and Backend Role

The Firebase Phone Authentication flow is primarily client-side. Here's how it works and where your Spring Boot backend fits in:

**Client (Mobile/Web App)**:

- The user enters their phone number.
- The client-side Firebase SDK (e.g., Android, iOS, Web) sends a request to Firebase to send an OTP to that number.
- Firebase sends the SMS OTP.
- The user receives the OTP and enters it into the client app.
- The client-side Firebase SDK verifies the OTP with Firebase.
- Upon successful verification, Firebase issues an ID Token to the client.

**Spring Boot Backend**:

- The client sends this Firebase ID Token to your Spring Boot backend (e.g., via a REST API call).
- Your Spring Boot backend uses the Firebase Admin SDK to verify the authenticity and integrity of this ID Token.
- If the token is valid, you can trust that the user has successfully authenticated their phone number with Firebase. You can then use the user's UID (User ID) from the token to identify them in your backend system, create a session, or grant access to protected resources.

## General Client-Side Flow

`User enters phone number -> Client calls Firebase SDK to send OTP -> Firebase sends SMS -> User enters OTP -> Client calls Firebase SDK to verify OTP -> Firebase returns ID Token -> Client sends ID Token to your Spring Boot backend (/api/auth/verify-firebase-token) -> Backend verifies token and responds.`

## Security Considerations

-**HTTPS**: Always use HTTPS for all communication between your client and Spring Boot backend to protect the ID Token in transit.
-**Input Validation**: Always validate input on the server-side (e.g., check if idToken is present and not empty).
-**Error Handling**: Implement robust error handling for Firebase Admin SDK calls and other backend logic.
-**Rate Limiting**: Consider implementing rate limiting on your /api/auth/verify-firebase-token endpoint to prevent abuse.
-**Protect Service Account Key**: Never commit your service account JSON file to public repositories. Use environment variables or secure configuration management tools in production.

## More on Firebase Auth

- firebase service account

`firebase-adminsdk-fbsvc@java-springboot-sms-otp.iam.gserviceaccount.com`

- admin sdk configuration support

```java
FileInputStream serviceAccount =
new FileInputStream("path/to/serviceAccountKey.json");

FirebaseOptions options = new FirebaseOptions.Builder()
  .setCredentials(GoogleCredentials.fromStream(serviceAccount))
  .build();

FirebaseApp.initializeApp(options);
```

## Catatan Kode sisi Klien

`/* global grecaptcha */` is a special comment for linters like ESLint. It tells ESLint: "Hey, grecaptcha is a variable that will exist globally in the browser environment, even if I don't explicitly define it in this file. Don't warn me about it being undefined."
