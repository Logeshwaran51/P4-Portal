package com.backend.Self_help.service;

import com.backend.Self_help.repository.JiraRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import com.backend.Self_help.model.JiraTicketRequest;

import java.util.HashMap;
import java.util.Map;

@Component
public class JiraService {
    @Value("${jira.username}")
    private String jiraUsername;

    @Value("${jira.api.token}")
    private String jiraApiToken;

    @Value("${jira.url}")
    private String jiraUrl;

    @Autowired
    private JiraRepo jiraRepo;

    public Map<String, Object> jiraRequestService(JiraTicketRequest request) {
        Map<String, Object> response = new HashMap<>();
        String apiUrl = jiraUrl + "/rest/api/2/issue";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(jiraUsername, jiraApiToken);

        try {
            Map<String, Object> payload = new HashMap<>();
            Map<String, Object> fields = new HashMap<>();

            fields.put("project", Map.of("key", "CRM"));
            fields.put("summary", request.getTitle());
            fields.put("description", request.getDescription());
            fields.put("issuetype", Map.of("name", "Request"));

            payload.put("fields", fields);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> jiraResponse = restTemplate.postForEntity(apiUrl, entity, Map.class);

            if (jiraResponse.getStatusCode().is2xxSuccessful()) {
                Map<String, Object> responseBody = jiraResponse.getBody();
                String ticketKey = (String) responseBody.get("key");
                String ticketUrl = jiraUrl + "/browse/" + ticketKey;

                // Set Jira URL in model and save to MongoDB
                request.setJiraUrl(ticketUrl);
                jiraRepo.save(request);

                response.put("status", true);
                response.put("data", ticketUrl); // Only URL in data
                response.put("error", "");
            } else {
                response.put("status", false);
                response.put("data", "");
                response.put("error", "JIRA API returned status: " + jiraResponse.getStatusCode());
            }

        } catch (Exception e) {
            response.put("status", false);
            response.put("data", "");
            response.put("error", "Failed to create JIRA ticket: " + e.getMessage());
            System.err.println("JIRA API Error: " + e.getMessage());
        }

        return response;
    }

}


