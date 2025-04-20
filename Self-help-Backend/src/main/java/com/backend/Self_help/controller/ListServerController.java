package com.backend.Self_help.controller;


import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.service.ListServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ListServerController {

    @Autowired
    ListServerService server;

    @GetMapping("/servers")
    public ResponseEntity<Map<String, Object>> getAllServersController(){
        Map<String, Object> serviceResponse = server.getAllServersService();
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/addServer")
    public ResponseEntity<Map<String, Object>> addServerController(@RequestBody ServerModel serverModel){
        Map<String, Object> serviceResponse =  server.addServerService(serverModel);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @DeleteMapping("/removeServer")
    public ResponseEntity<Map<String, Object>> removeServerController(@RequestBody ServerModel serverModel){
        Map<String, Object> serviceResponse =  server.removeServerService(serverModel);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/serverInfo")
    public Map<String, String> getServerInfo(@RequestBody Map<String, ?> server_json){
       return server.p4_info(server_json);

    }
}
