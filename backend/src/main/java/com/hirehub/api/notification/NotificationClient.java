package com.hirehub.api.notification;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NotificationClient {
    private static final Logger logger = LoggerFactory.getLogger(NotificationClient.class);
    private final RestClient client;

    public NotificationClient(RestClient.Builder builder, @Value("${hirehub.notifications.url}") String baseUrl) {
        this.client = builder.baseUrl(baseUrl).build();
    }

    public void publish(String type, Long applicationId, String message) {
        try {
            client.post()
                .uri("/api/notifications")
                .body(Map.of("type", type, "applicationId", applicationId, "message", message))
                .retrieve()
                .toBodilessEntity();
        } catch (RuntimeException exception) {
            logger.warn("Notification service is unavailable; event {} was not delivered", type);
        }
    }
}