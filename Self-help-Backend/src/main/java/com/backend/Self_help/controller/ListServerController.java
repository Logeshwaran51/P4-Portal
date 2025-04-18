package com.backend.Self_help.controller;


import com.backend.Self_help.model.ServerModel;
import com.backend.Self_help.service.ListServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class ListServerController {

    @Autowired
    ListServerService server;

    @GetMapping("/servers")
    public Map<String,?> getAllServers(){
        return server.getAllServers();
    }

    @PostMapping("/addServer")
    public boolean addServer(@RequestBody ServerModel serverModel){
        return server.addServer(serverModel);
    }

    @PostMapping("/removeServer")
    public boolean removeServer(@RequestBody ServerModel serverModel){
        return server.removeServer(serverModel);
    }

    @PostMapping("/serverInfo")
    public Map<String, String> getServerInfo(@RequestBody Map<String, ?> server_json){
       return server.p4_info(server_json);

    }
}
