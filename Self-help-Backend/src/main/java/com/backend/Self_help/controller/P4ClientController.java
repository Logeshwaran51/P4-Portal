package com.backend.Self_help.controller;

import com.backend.Self_help.service.P4ClientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4ClientController {

    @Autowired
    P4ClientsService p4client;

    @PostMapping("/clients")
    public ResponseEntity<Map<String, Object>> listClientController(@RequestBody Map<String, ?> listClientsBody) {

        Map<String, Object> serviceResponse = p4client.listAllClientsService(listClientsBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/clientsReloadList")
    public ResponseEntity<Map<String, Object>> listReloadClientController(@RequestBody Map<String, ?> listReloadClientsBody) {

        Map<String, Object> serviceResponse = p4client.listAllReloadClientsService(listReloadClientsBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @DeleteMapping("/clientDelete")
    public ResponseEntity<Map<String, Object>> deleteClientsController(@RequestBody Map<String, ?> deleteClientsListBody) {

        Map<String, Object> serviceResponse = p4client.deleteClientsService(deleteClientsListBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/clientUnload")
    public ResponseEntity<Map<String, Object>> unloadClientsController(@RequestBody Map<String, ?> unloadClientsListBody) {

        Map<String, Object> serviceResponse = p4client.unloadClientsService(unloadClientsListBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/clientReload")
    public ResponseEntity<Map<String,Object>> reloadClientsController(@RequestBody Map<String, ?> reloadClientsListBody) {
        Map<String, Object> serviceResponse = p4client.reloadClientsService(reloadClientsListBody);
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
