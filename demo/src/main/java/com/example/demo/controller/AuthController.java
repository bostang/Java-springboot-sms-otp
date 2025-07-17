package com.example.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord; // Import UserRecord
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/verify-firebase-token")
    public ResponseEntity<?> verifyFirebaseToken(@RequestBody Map<String, String> requestBody) {
        String idToken = requestBody.get("idToken");

        if (idToken == null || idToken.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "ID Token is missing."));
        }

        try {
            // Verify the ID token using Firebase Admin SDK
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            String uid = decodedToken.getUid();

            // Fetch the UserRecord to get more detailed user information, including the phone number
            UserRecord userRecord = FirebaseAuth.getInstance().getUser(uid);
            String phoneNumber = userRecord.getPhoneNumber(); // This is where you get the phone number
            String email = decodedToken.getEmail(); // Email can still be gotten from decodedToken

            // Log or use the user info
            System.out.println("Successfully verified Firebase ID Token for UID: " + uid);
            System.out.println("Phone Number: " + phoneNumber);

            // You can now perform your backend logic:
            // 1. Check if the user exists in your database.
            // 2. If not, create a new user entry.
            // 3. Create a session for the user (e.g., generate your own JWT or session token).
            // 4. Return a success response with any relevant user data or your custom token.

            return ResponseEntity.ok(Map.of(
                    "message", "Firebase token verified successfully!",
                    "uid", uid,
                    "phoneNumber", (phoneNumber != null ? phoneNumber : "N/A"), // Handle potential null phone number
                    "customBackendToken", "your-generated-backend-token-here" // Example
            ));

        } catch (FirebaseAuthException e) {
            // Token is invalid or expired
            System.err.println("Firebase token verification failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "Invalid or expired Firebase ID Token."));
        } catch (Exception e) {
            // General error
            System.err.println("An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An internal server error occurred."));
        }
    }
}