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

    public Map<String, ArrayList<String>> listAllLabels(Map<String,?> listLabels) {

        Map<String, ArrayList<String>> listLabelmap = new HashMap<>();
        ArrayList<String> labelsArr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) listLabels.get("server"));
            p4.setUSER_NAME((String) listLabels.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IFileSpec> fileSpecs = new ArrayList<>();


            GetLabelsOptions options = new GetLabelsOptions();
            options.setUserName((String) listLabels.get("user"));

            List<ILabelSummary> labels = server.getLabels(fileSpecs, options);

            if (labels != null && !labels.isEmpty()) {
                for (ILabelSummary label : labels) {
                    labelsArr.add(label.getName());
                }
            } else {
                labelsArr.add("No labels found.");
            }
        }catch (P4JavaException | URISyntaxException e) {
            labelsArr.add("Error: " + e.getMessage());
        }
        listLabelmap.put("labels",labelsArr);
        return listLabelmap;
    }

    public ArrayList<String> deleteLabels(Map<String,?> deleteLabelsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) deleteLabelsList.get("server"));
            p4.setUSER_NAME((String) deleteLabelsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = deleteLabelsList.get("labels");

            List<String> labelNames = (List<String>) labelsObject;

            for(String labelName : labelNames){
                boolean forceDelete = true;
                try {
                    result.add(server.deleteLabel(labelName,forceDelete));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

        }catch (P4JavaException | URISyntaxException e) {
            result.add("Error: " + e.getMessage());
        }

        return result;

    }

    public ArrayList<String> unloadLabels(Map<String,?> unloadLabelsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) unloadLabelsList.get("server"));
            p4.setUSER_NAME((String) unloadLabelsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = unloadLabelsList.get("labels");

            List<String> labelNames = (List<String>) labelsObject;
            UnloadOptions unloadOptions = new UnloadOptions();


            for(String labelName : labelNames){
                boolean forceDelete = true;
                try {
                    unloadOptions.setLabel(labelName);
                    result.add(server.unload(unloadOptions));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

        }catch (P4JavaException | URISyntaxException e) {
            result.add("Error: " + e.getMessage());
        }

        return result;

    }

    public ArrayList<String> reloadLabels(Map<String,?> reloadLabelsList) {
        ArrayList<String> result = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) reloadLabelsList.get("server"));
            p4.setUSER_NAME((String) reloadLabelsList.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            Object labelsObject = reloadLabelsList.get("labels");

            List<String> labelNames = (List<String>) labelsObject;
            ReloadOptions reloadOptions = new ReloadOptions();


            for(String labelName : labelNames){
                boolean forceDelete = true;
                try {
                    reloadOptions.setLabel(labelName);
                    result.add(server.reload(reloadOptions));

                } catch (RequestException e) {
                    result.add(e.getMessage());
                }
            }

        }catch (P4JavaException | URISyntaxException e) {
            result.add("Error: " + e.getMessage());
        }

        return result;

    }

    public Map<String, ArrayList<String>> listAllReloadLabels(Map<String,?> listReloadLabels) {
        Map<String, ArrayList<String>> listReloadLabelmap = new HashMap<>();
        ArrayList<String> labelsArr = new ArrayList<>();
        try {
            p4.setSERVER_URI((String) listReloadLabels.get("server"));
            p4.setUSER_NAME((String) listReloadLabels.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            List<IFileSpec> fileSpecs = new ArrayList<>();


            GetLabelsOptions options = new GetLabelsOptions();
            options.setUserName((String) listReloadLabels.get("user"));
            boolean unloaded = true;
            options.setUnloaded(unloaded);

            List<ILabelSummary> labels = server.getLabels(fileSpecs, options);

            if (labels != null && !labels.isEmpty()) {
                for (ILabelSummary label : labels) {
                    labelsArr.add(label.getName());
                }
            } else {
                labelsArr.add("No labels found.");
            }
        }catch (P4JavaException | URISyntaxException e) {
            labelsArr.add("Error: " + e.getMessage());
        }
        listReloadLabelmap.put("labels",labelsArr);
        return listReloadLabelmap;

    }
}
