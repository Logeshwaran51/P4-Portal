package com.backend.Self_help.repository;

import com.backend.Self_help.model.AdminLoginModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminLoginRepo extends MongoRepository<AdminLoginModel, String> {
    boolean existsByUserNameAndUserPassword(String userName, String userPassword);
}