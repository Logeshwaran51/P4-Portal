package com.backend.Self_help.repository;

import com.backend.Self_help.model.AdminLoginModel;
import com.backend.Self_help.model.ServerModel;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ServerRepo extends MongoRepository<ServerModel,String> {
}

