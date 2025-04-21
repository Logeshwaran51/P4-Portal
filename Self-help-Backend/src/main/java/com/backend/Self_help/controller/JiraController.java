package com.backend.Self_help.controller;
import com.backend.Self_help.model.JiraTicketRequest;
import com.backend.Self_help.service.JiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin()
@RequestMapping("/api/jira")
public class JiraController {

    @Autowired
    JiraService jiraService;

    @PostMapping("/create-ticket")
    public Map<String, Object> createJiraTicket(@RequestBody JiraTicketRequest request) {
        return jiraService.jiraRequestService(request);
    }

}
