package com.backend.Self_help.service;


import com.perforce.p4java.core.ILabelSummary;
import com.perforce.p4java.core.file.IFileSpec;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.exception.RequestException;
import com.perforce.p4java.option.server.GetLabelsOptions;
import com.perforce.p4java.option.server.ReloadOptions;
import com.perforce.p4java.option.server.UnloadOptions;
import com.perforce.p4java.server.IOptionsServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class P4LabelsService {

    @Autowired
    PerforceService p4;

    public Map<String, Object> listAllLabelsService(Map<String, ?> listLabelsBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> labelsArr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) listLabelsBody.get("server"));
            p4.setUSER_NAME((String) listLabelsBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IFileSpec> fileSpecs = new ArrayList<>();
            GetLabelsOptions options = new GetLabelsOptions();
            options.setUserName((String) listLabelsBody.get("user"));

            List<ILabelSummary> labels = server.getLabels(fileSpecs, options);

            if (labels != null && !labels.isEmpty()) {
                for (ILabelSummary label : labels) {
                    labelsArr.add(label.getName());
                }
            } else {
                // No labels found
                labelsArr.add("No labels found.");
            }

            server.disconnect();

            // Success response
            response.put("status", true);
            response.put("data", labelsArr);
            response.put("error", null);

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }

        return response;
    }

    public Map<String, Object> listAllReloadLabelsService(Map<String, ?> listReloadLabelsBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> labelsArr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) listReloadLabelsBody.get("server"));
            p4.setUSER_NAME((String) listReloadLabelsBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IFileSpec> fileSpecs = new ArrayList<>();

            GetLabelsOptions options = new GetLabelsOptions();
            options.setUserName((String) listReloadLabelsBody.get("user"));
            options.setUnloaded(true);

            List<ILabelSummary> labels = server.getLabels(fileSpecs, options);

            if (labels == null) {
                System.err.println("Labels list is null");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "Labels list is null");
                return response;
            }

            for (ILabelSummary label : labels) {
                if (label == null) {
                    System.err.println("null Label in labels list");
                    continue;
                }
                labelsArr.add(label.getName());
            }

            server.disconnect();
            response.put("status", true);
            response.put("data", labelsArr);
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

    public Map<String, Object> deleteLabelsService(Map<String, ?> deleteLabelsListBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) deleteLabelsListBody.get("server"));
            p4.setUSER_NAME((String) deleteLabelsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = deleteLabelsListBody.get("labels");
            List<String> labelNames = new ArrayList<>();

            if (labelsObject instanceof List<?>) {
                for (Object item : (List<?>) labelsObject) {
                    if (item instanceof String) {
                        labelNames.add((String) item);
                    }
                }
            } else {
                // Handle if labelsObject is not a list
                System.err.println("labels is not a list");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "labels is not a list");
                return response;
            }

            for (String labelName : labelNames) {
                boolean forceDelete = true;
                try {
                    result.add(server.deleteLabel(labelName, forceDelete));
                } catch (RequestException e) {
                    resultErr.add(e.getMessage());
                }
            }

            server.disconnect();

            // Build success response
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
            response.put("data", new ArrayList<>());  // Empty list on error
            response.put("error", e.getMessage());
        }

        return response;
    }

    public Map<String, Object> unloadLabelsService(Map<String,?> unloadLabelsListBody) {
        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) unloadLabelsListBody.get("server"));
            p4.setUSER_NAME((String) unloadLabelsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = unloadLabelsListBody.get("labels");

            List<String> labelNames = new ArrayList<>();

            if (labelsObject instanceof List<?>) {
                for (Object item : (List<?>) labelsObject) {
                    if (item instanceof String) {
                        labelNames.add((String) item);
                    }
                }
            } else {
                // Handle if labelsObject is not a list
                System.err.println("labels is not a list");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "labels is not a list");
                return response;
            }

            UnloadOptions unloadOptions = new UnloadOptions();
            boolean force = true;
            unloadOptions.setForce(force);

            for(String labelName : labelNames){
                try {
                    unloadOptions.setLabel(labelName);
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

        }catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }


        return response;

    }

    public Map<String, Object> reloadLabelsService(Map<String,?> reloadLabelsListBody) {

        Map<String, Object> response = new HashMap<>();
        ArrayList<String> result = new ArrayList<>();
        ArrayList<String> resultErr = new ArrayList<>();

        try {
            p4.setSERVER_URI((String) reloadLabelsListBody.get("server"));
            p4.setUSER_NAME((String) reloadLabelsListBody.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = reloadLabelsListBody.get("labels");

            List<String> labelNames = new ArrayList<>();

            if (labelsObject instanceof List<?>) {
                for (Object item : (List<?>) labelsObject) {
                    if (item instanceof String) {
                        labelNames.add((String) item);
                    }
                }
            } else {
                // Handle if labelsObject is not a list
                System.err.println("labels is not a list");
                response.put("status", false);
                response.put("data", new ArrayList<>());
                response.put("error", "labels is not a list");
                return response;
            }

            ReloadOptions reloadOptions = new ReloadOptions();
            boolean force = true;
            reloadOptions.setForce(force);

            for(String labelName : labelNames){
                try {
                    reloadOptions.setLabel(labelName);
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

        }catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());

            // Error response
            response.put("status", false);
            response.put("data", new ArrayList<>());
            response.put("error", e.getMessage());
        }


        return response;

    }

}