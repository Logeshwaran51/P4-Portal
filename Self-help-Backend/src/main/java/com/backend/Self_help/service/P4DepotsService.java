package com.backend.Self_help.service;

import com.perforce.p4java.core.IDepot;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.impl.generic.core.Depot;
import com.perforce.p4java.option.server.GetDepotsOptions;
import com.perforce.p4java.server.IOptionsServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class P4DepotsService {

    @Autowired
    PerforceService p4;

    public Map<String, ?> listDepots(Map<String,?> listDepot) {
        Map<String, ArrayList<String>> listDepotmap = new HashMap<>();
        ArrayList<String> depotArr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) listDepot.get("server"));
            p4.setUSER_NAME((String) listDepot.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IDepot> depots = server.getDepots();

            if (depots != null && !depots.isEmpty()) {
                for (IDepot depot : depots) {
                    depotArr.add(depot.getName());
                }
            } else {
                depotArr.add("No depots found on the server.");
            }

            listDepotmap.put("depots",depotArr);
            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return listDepotmap;
    }

    public Map<String,?> createDepot(Map<String,?> createDepot) {
        Map<String, String> createDepotResult = new HashMap<>();
        try {
            p4.setSERVER_URI((String) createDepot.get("server"));
            p4.setUSER_NAME((String) createDepot.get("user"));
            IOptionsServer server = p4.getOptionsServer();
            String depotType = (String) createDepot.get("depotType");
            Depot depot = new Depot();

            if (depotType.equalsIgnoreCase("local")){
                depot.setDepotType(IDepot.DepotType.LOCAL);
            } else if (depotType.equalsIgnoreCase("spec")) {
                depot.setDepotType(IDepot.DepotType.SPEC);
            } else if (depotType.equalsIgnoreCase("remote")) {
                depot.setDepotType(IDepot.DepotType.REMOTE);
            }else if (depotType.equalsIgnoreCase("stream")) {
                depot.setDepotType(IDepot.DepotType.STREAM);
            }else if (depotType.equalsIgnoreCase("archive")) {
                depot.setDepotType(IDepot.DepotType.ARCHIVE);
            }else if (depotType.equalsIgnoreCase("tangent")) {
                depot.setDepotType(IDepot.DepotType.TANGENT);
            }else if (depotType.equalsIgnoreCase("extension")) {
                depot.setDepotType(IDepot.DepotType.EXTENSION);
            }else if (depotType.equalsIgnoreCase("unload")) {
                depot.setDepotType(IDepot.DepotType.UNLOAD);
            }else if (depotType.equalsIgnoreCase("graph")) {
                depot.setDepotType(IDepot.DepotType.GRAPH);
            }else{
                depot.setDepotType(IDepot.DepotType.UNKNOWN);
            }

            depot.setOwnerName((String) createDepot.get("user"));
            depot.setName((String) createDepot.get("depotName"));
            depot.setMap((String) createDepot.get("depotMap"));

            createDepotResult.put("result", server.createDepot(depot));
            createDepotResult.put("depotName",(String) createDepot.get("depotName"));
            createDepotResult.put("depotType",(String) createDepot.get("depotType"));
            createDepotResult.put("depotMap",(String) createDepot.get("depotMap"));
            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            createDepotResult.put("error",e.getMessage());
        }
        return createDepotResult;
    }

    public Map<String,?> deleteDepot(Map<String,?> deleteDepots) {
        Map<String, Object> deleteDepotResult = new HashMap<>();
        ArrayList<String> deleteDepotArr = new ArrayList<>();
        ArrayList<String> errors = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) deleteDepots.get("server"));
            p4.setUSER_NAME((String) deleteDepots.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object depotObject = deleteDepots.get("depotName");
            List<String> deleteDepotNames = (List<String>) depotObject;

            for (String depotName : deleteDepotNames) {
                try {
                    String result = server.deleteDepot(depotName);
                    deleteDepotArr.add(result);
                } catch (P4JavaException e) {
                    errors.add(e.getMessage());
                }
            }

            if (!deleteDepotArr.isEmpty()) {
                deleteDepotResult.put("deleteDepotResult", deleteDepotArr);
            }
            if (!errors.isEmpty()) {
                deleteDepotResult.put("errors", errors);
            }

        } catch (P4JavaException | URISyntaxException e) {
            deleteDepotResult.put("error", e.getMessage());
            System.out.println(deleteDepotResult);
        }

        return deleteDepotResult;
    }
}
