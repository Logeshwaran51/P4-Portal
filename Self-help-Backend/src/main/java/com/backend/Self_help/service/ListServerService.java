package com.backend.Self_help.service;

import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.repository.ServerRepo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public List<ServerModel> getAllServers(){
        return server.findAll();
    }

    public void addServer(ServerModel serverModel) {
        server.save(serverModel);
    }
}
