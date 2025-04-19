package com.backend.Self_help.controller;

import com.backend.Self_help.service.P4LabelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4LabelController {

    @Autowired
    P4LabelsService p4Label;

    @PostMapping("/labels")
    public ResponseEntity<Map<String, Object>> listLabelController(@RequestBody Map<String, ?> listLabelsBody) {

        Map<String, Object> serviceResponse = p4Label.listAllLabelsService(listLabelsBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/labelsReloadList")
    public ResponseEntity<Map<String, Object>> listReloadLabelController(@RequestBody Map<String, ?> listReloadLabelsBody) {
        Map<String, Object> serviceResponse =  p4Label.listAllReloadLabelsService(listReloadLabelsBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @DeleteMapping("/labelDelete")
    public ResponseEntity<Map<String, Object>> deleteLabelsController(@RequestBody Map<String, ?> deleteLabelsListBody) {
        Map<String, Object> serviceResponse =  p4Label.deleteLabelsService(deleteLabelsListBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/labelUnload")
    public ResponseEntity<Map<String, Object>> unloadLabelsController(@RequestBody Map<String, ?> unloadLabelsListBody) {
        Map<String, Object> serviceResponse =  p4Label.unloadLabelsService(unloadLabelsListBody);
        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @PostMapping("/labelReload")
    public ResponseEntity<Map<String, Object>> reloadLabelsController(@RequestBody Map<String, ?> reloadLabelsListBody) {
        Map<String, Object> serviceResponse =  p4Label.reloadLabelsService(reloadLabelsListBody);
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
