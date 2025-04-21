package com.backend.Self_help.controller;


import com.backend.Self_help.model.AdminLoginModel;
import com.backend.Self_help.model.UserLoginModel;
import com.backend.Self_help.service.LoginService;
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
public class LoginController {

    @Autowired
    LoginService login;

    @RequestMapping("/adminLogin")
    public ResponseEntity<Map<String,Object>> adminLoginController(@RequestBody AdminLoginModel adminBody){

        Map<String, Object> serviceResponse = login.adminLoginService(adminBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @RequestMapping("/userLogin")
    public ResponseEntity<Map<String,Object>> userLoginController(@RequestBody UserLoginModel userBody){

        Map<String, Object> serviceResponse = login.userLoginService(userBody);

        boolean status = (boolean) serviceResponse.get("status");

        if (status) {
            // Status true => OK 200
            return ResponseEntity.ok(serviceResponse);
        } else {
            // Status false => BAD_REQUEST 400
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(serviceResponse);
        }
    }

    @RequestMapping("/userRegister")
    public ResponseEntity<Map<String,Object>> userRegisterController(@RequestBody UserLoginModel userRegisterBody){

        Map<String, Object> serviceResponse = login.userRegisterService(userRegisterBody);

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
