package com.backend.Self_help.repository;

import com.backend.Self_help.model.JiraTicketRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JiraRepo extends MongoRepository<JiraTicketRequest, String> {
}
