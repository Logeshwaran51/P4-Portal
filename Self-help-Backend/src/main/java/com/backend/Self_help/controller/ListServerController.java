package com.backend.Self_help.controller;


import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.service.ListServerService;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ListServerController {

    @Autowired
    ListServerService server;

    @GetMapping("/servers")
    public List<ServerModel> getAllServers(){
        return server.getAllServers();
    }

    @PostMapping("/addServer")
    public void addServer(@RequestBody ServerModel serverModel){
        server.addServer(serverModel);

    }
    @PostMapping("/serverInfo")
    public Map<String, String> getServerInfo(@RequestBody Map<String, ?> server_json){
       return server.p4_info(server_json);

    }
}
