package com.backend.Self_help.service;


import com.backend.Self_help.model.AdminLoginModel;
import com.backend.Self_help.model.UserLoginModel;
import com.backend.Self_help.repository.AdminLoginRepo;
import com.backend.Self_help.repository.UserLoginRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class LoginService {

    @Autowired
    AdminLoginRepo adminLoginRepo;

    @Autowired
    UserLoginRepo userLoginRepo;

    public boolean adminLoginService(AdminLoginModel adminBody) {


        String loginUserName = adminBody.getUserName();
        String loginUserPassword = adminBody.getUserPassword();

        return adminLoginRepo.existsByUserNameAndUserPassword(loginUserName,loginUserPassword);

    }

    public boolean userLoginService(UserLoginModel userBody) {
        String loginUserName = userBody.getUserName();
        String loginUserPassword = userBody.getUserPassword();

        return userLoginRepo.existsByUserNameAndUserPassword(loginUserName,loginUserPassword);
    }

    public boolean userRegisterService(UserLoginModel userRegisterBody) {
        String registerUserName = userRegisterBody.getUserName();
        String registerUserPassword = userRegisterBody.getUserPassword();

        if(userLoginRepo.existsByUserNameAndUserPassword(registerUserName,registerUserPassword)){
            return false;
        }else{
           try {
               userLoginRepo.save(userRegisterBody);
               return true;
           } catch (Exception e) {
               System.out.println(e);
               return false;
           }

        }

    }
}
