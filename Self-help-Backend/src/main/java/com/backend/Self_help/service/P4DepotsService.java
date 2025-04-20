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

    public Map<String, Object> listDepotsService(Map<String, ?> listDepotBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> depotArr = new ArrayList<>();

        try {
            // Set Perforce connection details
            p4.setSERVER_URI((String) listDepotBody.get("server"));
            p4.setUSER_NAME((String) listDepotBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            // Fetch depots from server
            List<IDepot> depots = server.getDepots();

            if (depots == null) {
                System.err.println("Depot list is null");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Depot list is null");
                return response;
            }

            for (IDepot depot : depots) {
                if (depot == null) {
                    System.err.println("Null depot in depot list");
                    continue;
                }
                depotArr.add(depot.getName());
            }

            server.disconnect();

            // Success Response
            response.put("status", true);
            response.put("data", depotArr);
            response.put("error", null);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
            // Error Response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }

        return response;
    }



    public Map<String, Object> createDepotService(Map<String, ?> listDepotBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> resultDepot = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) listDepotBody.get("server"));
            p4.setUSER_NAME((String) listDepotBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();
            Depot depot = new Depot();

            depot.setDepotType(IDepot.DepotType.LOCAL);
            depot.setOwnerName((String) listDepotBody.get("user"));
            depot.setName((String) listDepotBody.get("depotName"));
            depot.setMap((String) listDepotBody.get("depotMap"));

            String result = server.createDepot(depot);

            resultDepot.add(result);

            server.disconnect();

            // Success Response
            response.put("status", true);
            response.put("data", resultDepot);
            response.put("error", null);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
            // Error Response
            response.put("status", false);
            response.put("data", Collections.emptyMap());
            response.put("error", e.getMessage());
        }

        return response;
    }



    public Map<String, Object> deleteDepotService(Map<String, ?> deleteDepotsBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) deleteDepotsBody.get("server"));
            p4.setUSER_NAME((String) deleteDepotsBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object depotObject = deleteDepotsBody.get("depotName");
            List<String> deleteDepotNames = new ArrayList<>();

            if (depotObject instanceof List<?>) {
                for (Object item : (List<?>) depotObject) {
                    if (item instanceof String) {
                        deleteDepotNames.add((String) item);
                    }
                }
            } else {
                // Handle if depotObject is not a list
                System.err.println("depotName is not a list");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Invalid format: 'depotName' should be a list of strings");
                return response;
            }

            for (String depotName : deleteDepotNames) {
                try {
                    String resultMessage = server.deleteDepot(depotName);
                    result.add(resultMessage);
                } catch (P4JavaException e) {
                    resultErr.add(e.getMessage());
                }
            }

            server.disconnect();

            // Build response
            if (resultErr.isEmpty()) {
                response.put("status", true);
            } else {
                response.put("status", false);
            }
            response.put("data", result);
            response.put("error", resultErr);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Build error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }

        return response;
    }

}