package com.backend.Self_help.service;

import com.perforce.p4java.client.IClientSummary;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.exception.RequestException;
import com.perforce.p4java.option.server.GetClientsOptions;
import com.perforce.p4java.option.server.ReloadOptions;
import com.perforce.p4java.option.server.UnloadOptions;
import com.perforce.p4java.server.IOptionsServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.*;

@Component
public class P4ClientsService {

    @Autowired
    PerforceService p4;

    public Map<String, Object> listAllClientsService(Map<String, ?> listClientsBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> clientsArr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) listClientsBody.get("server"));
            p4.setUSER_NAME((String) listClientsBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IClientSummary> clientList = server.getClients(new GetClientsOptions().setUserName((String) listClientsBody.get("user")));

            if (clientList == null) {
                System.err.println("Client list is null");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Client list is null");
                return response;
            }

            for (IClientSummary clientSummary : clientList) {
                if (clientSummary == null) {
                    System.err.println("Null Client in clients list");
                    continue;
                }
                clientsArr.add(clientSummary.getName());
            }

            server.disconnect();

            // Success Response
            response.put("status", true);
            response.put("data", clientsArr);
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

    public Map<String, Object> listAllReloadClientsService(Map<String,?> listReloadClientsBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> clientsArr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) listReloadClientsBody.get("server"));
            p4.setUSER_NAME((String) listReloadClientsBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            GetClientsOptions getClientsOptions = new GetClientsOptions();
            getClientsOptions.setUserName((String) listReloadClientsBody.get("user"));
            boolean unloaded = true;
            getClientsOptions.setUnloaded(unloaded);
            List<IClientSummary> clientList = server.getClients(getClientsOptions);
            if (clientList == null) {
                System.err.println("Client list is null");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Client list is null");
                return response;
            }
            for (IClientSummary clientSummary : clientList) {
                if (clientSummary == null) {
                    System.err.println("null Client in clients list");
                    continue;
                }
                clientsArr.add(clientSummary.getName());
            }

            server.disconnect();
            response.put("status", true);
            response.put("data", clientsArr);
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

    public Map<String, Object> deleteClientsService(Map<String, ?> deleteClientsListBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) deleteClientsListBody.get("server"));
            p4.setUSER_NAME((String) deleteClientsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = deleteClientsListBody.get("clients");
            List<String> clientNames = new ArrayList<>();

            if (clientsObject instanceof List<?>) {
                for (Object item : (List<?>) clientsObject) {
                    if (item instanceof String) {
                        clientNames.add((String) item);
                    }
                }
            } else {
                // Handle if clientsObject is not a list
                System.err.println("clients is not a list");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Invalid format: 'clients' should be a list of strings");
                return response;

            }

            for (String clientName : clientNames) {
                boolean forceDelete = false;
                try {
                    result.add(server.deleteClient(clientName, forceDelete));
                } catch (RequestException e) {
                    resultErr.add(e.getMessage());
                }
            }

            server.disconnect();

            // Build success response
            if(resultErr.isEmpty()){
                response.put("status", true);
            }else {
                response.put("status", false);
            }
            response.put("data", result);
            response.put("error", resultErr);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Build error response
            response.put("status", false);
            response.put("data", new ArrayList<>());  // Empty list on error
            response.put("error", e.getMessage());
        }

        return response;
    }

    public Map<String, Object> unloadClientsService(Map<String, ?> unloadClientsListBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) unloadClientsListBody.get("server"));
            p4.setUSER_NAME((String) unloadClientsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = unloadClientsListBody.get("clients");
            List<String> clientNames = new ArrayList<>();

            if (clientsObject instanceof List<?>) {
                for (Object item : (List<?>) clientsObject) {
                    if (item instanceof String) {
                        clientNames.add((String) item);
                    }
                }
            } else {
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Invalid format: 'clients' should be a list of strings");
                return response;
            }

            UnloadOptions unloadOptions = new UnloadOptions();

            for (String clientName : clientNames) {
                try {
                    unloadOptions.setClient(clientName);
                    result.add(server.unload(unloadOptions));
                } catch (RequestException e) {
                    resultErr.add(e.getMessage());
                }
            }

            server.disconnect();

            // Success response
            if(resultErr.isEmpty()){
                response.put("status", true);
            }else {
                response.put("status", false);
            }
            response.put("data", result);
            response.put("error", resultErr);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }

        return response;
    }

    public Map<String, Object> reloadClientsService(Map<String, ?> reloadClientsListBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) reloadClientsListBody.get("server"));
            p4.setUSER_NAME((String) reloadClientsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = reloadClientsListBody.get("clients");
            List<String> clientNames = new ArrayList<>();

            if (clientsObject instanceof List<?>) {
                for (Object item : (List<?>) clientsObject) {
                    if (item instanceof String) {
                        clientNames.add((String) item);
                    }
                }
            } else {
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Invalid format: 'clients' should be a list of strings");
                return response;
            }

            ReloadOptions reloadOptions = new ReloadOptions();

            for (String clientName : clientNames) {
                try {
                    reloadOptions.setClient(clientName);
                    result.add(server.reload(reloadOptions));
                } catch (RequestException e) {
                    resultErr.add(e.getMessage());
                }
            }

            server.disconnect();

            // Success response
            if(resultErr.isEmpty()){
                response.put("status", true);
            }else {
                response.put("status", false);
            }
            response.put("data", result);
            response.put("error", resultErr);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }

        return response;
    }

}

