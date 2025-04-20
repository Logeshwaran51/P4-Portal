package com.backend.Self_help.service;

import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.repository.ServerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ListServerService {

    @Autowired
    ServerRepo server;

    @Autowired
    ServerInfoService info;

    public Map<String, String> p4_info(Map<String, ?> server_json){
        return info.printServerInfo(server_json);
    }

    public Map<String, Object> getAllServersService() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ServerModel> servers = server.findAll();

            response.put("status", true);
            response.put("data", servers);
            response.put("error", new ArrayList<>()); // Empty errors
        } catch (Exception e) {
            System.err.println("Error fetching servers: " + e.getMessage());
            response.put("status", false);
            response.put("data", new ArrayList<>()); // Empty data
            response.put("error", e.getMessage());
        }
        return response;
    }


    public Map<String, Object> addServerService(ServerModel serverModel) {
        Map<String, Object> response = new HashMap<>();
        try {
            if(!server.existsByServer(serverModel.getServer())){
                server.save(serverModel);
                response.put("status", true);
                response.put("data", "Server added successfully");
                response.put("error", new ArrayList<>());
            }else {
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Server "+serverModel.getServer()+" is already exists");
            }

        } catch (Exception e) {
            System.err.println("Error adding server: " + e.getMessage());
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }
        return response;
    }


    public Map<String, Object> removeServerService(ServerModel serverModel) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<ServerModel> serverList = server.findAll();
            String serverNameToDelete = serverModel.getServer();

            boolean found = false;
            for (ServerModel s : serverList) {
                if (serverNameToDelete.equals(s.getServer())) {
                    server.delete(s);
                    found = true;
                    break;
                }
            }

            if (found) {
                response.put("status", true);
                response.put("data", "Server deleted successfully");
                response.put("error", new ArrayList<>());
            } else {
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Server not found: " + serverNameToDelete);
            }
        } catch (Exception e) {
            System.err.println("Error deleting server: " + e.getMessage());
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }
        return response;
    }

}
