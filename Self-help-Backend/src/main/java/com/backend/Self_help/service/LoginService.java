package com.backend.Self_help.service;


import com.backend.Self_help.model.AdminLoginModel;
import com.backend.Self_help.model.UserLoginModel;
import com.backend.Self_help.repository.AdminLoginRepo;
import com.backend.Self_help.repository.UserLoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;


@Service
public class LoginService {

    @Autowired
    AdminLoginRepo adminLoginRepo;

    @Autowired
    UserLoginRepo userLoginRepo;

    public Map<String, Object> adminLoginService(AdminLoginModel adminBody) {
        Map<String, Object> response = new HashMap<>();
        try {
            String loginUserName = adminBody.getUserName();
            String loginUserPassword = adminBody.getUserPassword();

            response.put("status", adminLoginRepo.existsByUserNameAndUserPassword(loginUserName, loginUserPassword));
            response.put("data", "Logged in Successfully!");
            response.put("error", null);

        } catch (Exception e) {
            System.err.println("Error during admin login: " + e.getMessage());
            response.put("status", false);
            response.put("data", Collections.emptyMap());
            response.put("error", e.getMessage());
        }

        return response;
    }


    public Map<String, Object> userLoginService(UserLoginModel userBody) {
        Map<String, Object> response = new HashMap<>();
        try {
            String loginUserName = userBody.getUserName();
            String loginUserPassword = userBody.getUserPassword();

            boolean exists = userLoginRepo.existsByUserNameAndUserPassword(loginUserName, loginUserPassword);

            response.put("status", exists);
            response.put("data", "Logged in Successfully!");
            response.put("error", null);

        } catch (Exception e) {
            System.err.println("Error during user login: " + e.getMessage());
            response.put("status", false);
            response.put("data", Collections.emptyMap());
            response.put("error", e.getMessage());
        }
        return response;
    }


    public Map<String, Object> userRegisterService(UserLoginModel userRegisterBody) {
        Map<String, Object> response = new HashMap<>();
        try {
            String registerUserName = userRegisterBody.getUserName();
            String registerUserPassword = userRegisterBody.getUserPassword();

            if (userLoginRepo.existsByUserNameAndUserPassword(registerUserName, registerUserPassword)) {
                response.put("status", false);
                response.put("data", Collections.emptyMap());
                response.put("error", "User already exists with provided credentials");
            } else {
                userLoginRepo.save(userRegisterBody);
                response.put("status", true);
                response.put("data", "Registered Successfully!");
                response.put("error", null);
            }

        } catch (Exception e) {
            System.err.println("Error during user registration: " + e.getMessage());
            response.put("status", false);
            response.put("data", Collections.emptyMap());
            response.put("error", e.getMessage());
        }
        return response;
    }

}
