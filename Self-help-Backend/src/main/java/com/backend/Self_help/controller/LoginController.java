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
    public ResponseEntity<Boolean> adminLoginController(@RequestBody AdminLoginModel adminBody){

        boolean isAuthenticated = login.adminLoginService(adminBody);

        if (isAuthenticated) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }

    @RequestMapping("/userLogin")
    public ResponseEntity<Boolean> userLoginController(@RequestBody UserLoginModel userBody){

        boolean isAuthenticated = login.userLoginService(userBody);

        if (isAuthenticated) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }

    @RequestMapping("/userRegister")
    public ResponseEntity<Boolean> userRegisterController(@RequestBody UserLoginModel userRegisterBody){

        boolean isAuthenticated = login.userRegisterService(userRegisterBody);

        if (isAuthenticated) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }
    }
}
