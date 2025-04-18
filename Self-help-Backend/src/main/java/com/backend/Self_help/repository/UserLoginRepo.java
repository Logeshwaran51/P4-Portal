package com.backend.Self_help.repository;

import com.backend.Self_help.model.UserLoginModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserLoginRepo extends MongoRepository<UserLoginModel, String> {
    boolean existsByUserNameAndUserPassword(String userName, String userPassword);
}