package com.backend.Self_help.controller;


import com.backend.Self_help.service.P4DepotsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4DepotController {

    @Autowired
    P4DepotsService p4depot;

    @PostMapping("/listDepots")
    public Map<String,?> listDepots(@RequestBody Map<String, ?> listDepot){
        return p4depot.listDepots(listDepot);
    }

    @PostMapping("/createDepots")
    public Map<String,?> createDepots(@RequestBody Map<String, ?> createDepot){
        return p4depot.createDepot(createDepot);
    }

    @DeleteMapping("/deleteDepots")
    public Map<String,?> deleteDepots(@RequestBody Map<String, ?> deleteDepots){
        return p4depot.deleteDepot(deleteDepots);
    }


}
