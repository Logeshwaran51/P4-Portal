package com.backend.Self_help.service;

import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.repository.ServerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Map<String,?> getAllServers(){
        List<ServerModel> servers = server.findAll(); // assuming server.findAll() returns List<ServerModel>

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Servers fetched successfully");
        response.put("data", servers);
        return  response;
    }

    public boolean addServer(ServerModel serverModel) {
        try {
            server.save(serverModel);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }

    public boolean removeServer(ServerModel serverModel) {
        try {
            List<ServerModel> serverList = server.findAll();

            String serverNameToDelete = serverModel.getServer();

            for (ServerModel s : serverList) {
                if (serverNameToDelete.equals(s.getServer())) {
                    server.delete(s);  // Use getter from Lombok
                    return true;
                }
            }

            System.out.println("Server not found: " + serverNameToDelete);
            return false;
        } catch (Exception e) {
            System.out.println("Error deleting server: " + e.getMessage());
            return false;
        }
    }
}
