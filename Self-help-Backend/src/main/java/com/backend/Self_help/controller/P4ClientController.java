package com.backend.Self_help.controller;

import com.backend.Self_help.service.P4ClientsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class P4ClientController {

    @Autowired
    P4ClientsService p4client;

    @PostMapping("/clients")
    public Map<String, ArrayList<String>> listClient(@RequestBody Map<String, ?> listClients) {
        return p4client.listAllClients(listClients);
    }

    @DeleteMapping("/clientDelete")
    public ArrayList<String> deleteClients(@RequestBody Map<String, ?> deleteClientsList) {
        return p4client.deleteClients(deleteClientsList);
    }

    @PostMapping("/clientUnload")
    public ArrayList<String> unloadClients(@RequestBody Map<String, ?> unloadClientsList) {
        return p4client.unloadClients(unloadClientsList);
    }

    @PostMapping("/clientReload")
    public ArrayList<String> reloadClients(@RequestBody Map<String, ?> reloadClientsList) {
        return p4client.reloadClients(reloadClientsList);
    }

}
