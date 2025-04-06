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

    public Map<String, ArrayList<String>> listAllClients(Map<String, ?> listClients) {
        Map<String, ArrayList<String>> listClientmap = new HashMap<>();
        ArrayList<String> clientsArr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) listClients.get("server"));
            p4.setUSER_NAME((String) listClients.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IClientSummary> clientList = server.getClients(new GetClientsOptions().setUserName((String) listClients.get("user")));
            if (clientList == null) {
                System.err.println("Client list is null");
                return listClientmap;
            }
            for (IClientSummary clientSummary : clientList) {


                if (clientSummary == null) {
                    System.err.println("null Client in clients list");
                    continue;
                }

                clientsArr.add(clientSummary.getName());

            }

            server.disconnect();
            listClientmap.put("clients", clientsArr);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }

        return listClientmap;
    }

    public ArrayList<String> deleteClients(Map<String, ?> deleteClientsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) deleteClientsList.get("server"));
            p4.setUSER_NAME((String) deleteClientsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = deleteClientsList.get("clients");

            List<String> clientNames = (List<String>) clientsObject;

            for (String clientName : clientNames) {
                boolean forceDelete = true;
                try {
                    result.add(server.deleteClient(clientName, forceDelete));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return result;

    }

    public ArrayList<String> unloadClients(Map<String,?> unloadClientsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) unloadClientsList.get("server"));
            p4.setUSER_NAME((String) unloadClientsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = unloadClientsList.get("clients");

            List<String> clientNames = (List<String>) clientsObject;
            UnloadOptions unloadOptions = new UnloadOptions();
            for (String clientName : clientNames) {
                try {
                    unloadOptions.setClient(clientName);
                    result.add(server.unload(unloadOptions));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return result;

    }

    public ArrayList<String> reloadClients(Map<String,?> reloadClientsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) reloadClientsList.get("server"));
            p4.setUSER_NAME((String) reloadClientsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object clientsObject = reloadClientsList.get("clients");

            List<String> clientNames = (List<String>) clientsObject;
            ReloadOptions reloadOptions = new ReloadOptions();

            for (String clientName : clientNames) {
                try {
                    reloadOptions.setClient(clientName);
                    result.add(server.reload(reloadOptions));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

            server.disconnect();

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        }
        return result;

    }
}

