package com.backend.Self_help.service;

import com.perforce.p4java.core.IDepot;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.impl.generic.core.Depot;
import com.perforce.p4java.option.server.GetDepotsOptions;
import com.perforce.p4java.server.IOptionsServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.*;

@Component
public class P4DepotsService {

    @Autowired
    PerforceService p4;

    public Map<String, ?> listDepots(Map<String, ?> listDepot) {
        Map<String, Object> response = new HashMap<>();
        List<String> depotList = new ArrayList<>();

        try {
            // Set Perforce connection details
            p4.setSERVER_URI((String) listDepot.get("server"));
            p4.setUSER_NAME((String) listDepot.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            // Fetch depots from server
            List<IDepot> depots = server.getDepots();

            if (depots != null && !depots.isEmpty()) {
                for (IDepot depot : depots) {
                    depotList.add(depot.getName());
                }
                response.put("success", true);
                response.put("message", "Depots fetched successfully");
                response.put("data", depotList);
            } else {
                response.put("success", false);
                response.put("message", "No depots found on the server");
                response.put("data", Collections.emptyList());
            }

            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            response.put("success", false);
            response.put("message", "Error fetching depots: " + e.getMessage());
            response.put("data", Collections.emptyList());
        }

        return response;
    }


    public Map<String, ?> createDepot(Map<String, ?> createDepot) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> createDepotResult = new HashMap<>();

        try {
            p4.setSERVER_URI((String) createDepot.get("server"));
            p4.setUSER_NAME((String) createDepot.get("user"));
            IOptionsServer server = p4.getOptionsServer();
            Depot depot = new Depot();

            depot.setDepotType(IDepot.DepotType.LOCAL);
            depot.setOwnerName((String) createDepot.get("user"));
            depot.setName((String) createDepot.get("depotName"));
            depot.setMap((String) createDepot.get("depotMap"));

            createDepotResult.put("result", server.createDepot(depot));
            createDepotResult.put("depotName", (String) createDepot.get("depotName"));
            createDepotResult.put("depotMap", (String) createDepot.get("depotMap"));

            response.put("success", true);
            response.put("message", "Depot created successfully");
            response.put("data", createDepotResult);

            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            response.put("success", false);
            response.put("message", "Error creating depot: " + e.getMessage());
            response.put("data", Collections.emptyMap());
        }

        return response;
    }


    public Map<String, ?> deleteDepot(Map<String, ?> deleteDepots) {
        Map<String, Object> response = new HashMap<>();
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

            response.put("success", errors.isEmpty());
            response.put("message", errors.isEmpty() ? "Depots deleted successfully" : "Some depots failed to delete");
            response.put("data", deleteDepotResult.isEmpty() ? Collections.emptyMap() : deleteDepotResult);

        } catch (P4JavaException | URISyntaxException e) {
            response.put("success", false);
            response.put("message", "Error deleting depots: " + e.getMessage());
            response.put("data", Collections.emptyMap());
        }

        return response;
    }
}