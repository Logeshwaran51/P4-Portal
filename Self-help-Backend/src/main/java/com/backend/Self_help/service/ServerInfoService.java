package com.backend.Self_help.service;

import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.server.IOptionsServer;
import com.perforce.p4java.server.IServerInfo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;

@Component
public class ServerInfoService {

    @Autowired
    PerforceService p4;

    public Map<String, String> printServerInfo(Map<String, ?> server_json){
        Map <String,String> serverJson = new HashMap<>();
        try {
            p4.setSERVER_URI((String) server_json.get("server"));
            p4.setUSER_NAME((String) server_json.get("user"));
            IOptionsServer server = p4.getOptionsServer();
            IServerInfo serverInfo = server.getServerInfo();

            serverJson.put("User Name", serverInfo.getUserName());
            serverJson.put("Client Name", serverInfo.getClientName());
            serverJson.put("Client Host", serverInfo.getClientHost());
            serverJson.put("Current Directory", serverInfo.getClientRoot());
            serverJson.put("Peer Address", serverInfo.getPeerAddress());
            serverJson.put("Client Address", serverInfo.getClientAddress());
            serverJson.put("Server Address", serverInfo.getServerAddress());
            serverJson.put("Server Root", serverInfo.getServerRoot());
            serverJson.put("Server Date", serverInfo.getServerDate());
            serverJson.put("Server Uptime", serverInfo.getServerUptime());
            serverJson.put("Server Version", serverInfo.getServerVersion());
            serverJson.put("Server License", serverInfo.getServerLicense());


            server.disconnect();


        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }

        return serverJson;
    }

}
