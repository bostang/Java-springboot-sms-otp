package com.example.demo.config;
// FirebaseConfig.java

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        // Path to your service account key file in src/main/resources
        InputStream serviceAccount = new ClassPathResource("model-parsec-465503-p3-firebase-adminsdk-fbsvc-692079f928.json").getInputStream();

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                // You can also set a database URL if you're using Realtime Database or Firestore
                // .setDatabaseUrl("https://your-project-id.firebaseio.com")
                .build();

        if (FirebaseApp.getApps().isEmpty()) { // Ensure only one FirebaseApp instance is initialized
            return FirebaseApp.initializeApp(options);
        } else {
            return FirebaseApp.getInstance();
        }
    }
}