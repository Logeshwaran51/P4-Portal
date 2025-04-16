package com.backend.Self_help.controller;


import com.backend.Self_help.service.P4SanityService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Map<String,?> sanity(@RequestBody Map<String, ?> p4SanityData){
        return p4sanity.p4Sanity(p4SanityData);

    }
}
