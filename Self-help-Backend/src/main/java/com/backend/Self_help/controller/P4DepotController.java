package com.backend.Self_help.controller;


import com.backend.Self_help.service.P4DepotsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4DepotController {

    @Autowired
    P4DepotsService p4depot;

    @PostMapping("/listDepots")
    public ResponseEntity<Map<String,Object>> listDepotsController(@RequestBody Map<String, ?> listDepotBody){
        Map<String, Object> serviceResponse = p4depot.listDepotsService(listDepotBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/createDepots")
    public ResponseEntity<Map<String, Object>> createDepotsController(@RequestBody Map<String, ?> createDepotBody){
        Map<String, Object> serviceResponse = p4depot.createDepotService(createDepotBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @DeleteMapping("/deleteDepots")
    public ResponseEntity<Map<String, Object>> deleteDepotsController(@RequestBody Map<String, ?> deleteDepotsBody){
        Map<String, Object> serviceResponse = p4depot.deleteDepotService(deleteDepotsBody);
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
