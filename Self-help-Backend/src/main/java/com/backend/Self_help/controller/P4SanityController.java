package com.backend.Self_help.controller;


import com.backend.Self_help.service.P4SanityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4SanityController {

    @Autowired
    P4SanityService p4sanity;

    @RequestMapping("/sanity")
    public ResponseEntity<Map<String, Object>> sanityController(@RequestBody Map<String, ?> p4SanityBody){
        Map<String, Object> serviceResponse = p4sanity.p4SanityService(p4SanityBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }

    }
}
