package com.backend.Self_help.service;


import com.perforce.p4java.client.IClient;
import com.perforce.p4java.core.ChangelistStatus;
import com.perforce.p4java.core.IChangelist;
import com.perforce.p4java.core.IChangelistSummary;
import com.perforce.p4java.core.file.FileSpecBuilder;
import com.perforce.p4java.core.file.FileSpecOpStatus;
import com.perforce.p4java.core.file.IFileSpec;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.impl.generic.client.ClientView;
import com.perforce.p4java.impl.generic.core.Changelist;
import com.perforce.p4java.impl.generic.core.ChangelistSummary;
import com.perforce.p4java.impl.generic.core.file.FileSpec;
import com.perforce.p4java.impl.mapbased.client.Client;
import com.perforce.p4java.impl.mapbased.server.Server;
import com.perforce.p4java.option.Options;
import com.perforce.p4java.option.changelist.SubmitOptions;
import com.perforce.p4java.option.client.AddFilesOptions;
import com.perforce.p4java.option.client.EditFilesOptions;
import com.perforce.p4java.option.client.SyncOptions;
import com.perforce.p4java.option.server.ChangelistOptions;
import com.perforce.p4java.option.server.OpenedFilesOptions;
import com.perforce.p4java.server.IOptionsServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.URISyntaxException;
import java.sql.Array;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class P4SanityService {

    @Autowired
    PerforceService p4;

    public Map<String,?> p4Sanity(Map<String,?> p4SanityData) {

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy_MM_dd_HH_mm_ss");
        String formattedDateTime = now.format(formatter);

        Map<String, String> p4SanityMap = new HashMap<>();

        String clientName = "p4sanity_"+formattedDateTime;
        try {
            p4.setSERVER_URI((String) p4SanityData.get("server"));
            p4.setUSER_NAME((String) p4SanityData.get("user"));
            IOptionsServer server = p4.getOptionsServer();

            //P4 Client Creation
            IClient newClient = new Client(server);
            newClient.setName(clientName);
            newClient.setRoot("C:\\Users\\ulaga\\Logeshwaran\\BITS PROJECT\\p4javaWorkspace");
            newClient.setServer(server);
            ClientView clientView = new ClientView();
            String p4ClientPath = p4SanityData.get("p4Path").toString()+" //"+clientName+"/...";
            ClientView.ClientViewMapping clientViewMapping = new ClientView.ClientViewMapping(0, p4ClientPath);
            clientView.addEntry(clientViewMapping);
            newClient.setClientView(clientView);
            newClient.setOwnerName((String) p4SanityData.get("user"));
            p4SanityMap.put("clientCreationResult", server.createClient(newClient));

            //P4 Listing Files
            List<IFileSpec> fileSpecs = new ArrayList<>();
            fileSpecs.add(new FileSpec(p4SanityData.get("p4Path").toString()));
            boolean includeAllRevs = false;
            List<IFileSpec> allFiles = server.getDepotFiles(fileSpecs, includeAllRevs);
            List<IFileSpec> syncFile = new ArrayList<>();
            syncFile.add(allFiles.getFirst());
            p4SanityMap.put("syncPath", syncFile.toString());

            //P4 Sync a file
            server.setCurrentClient(newClient);
            boolean forceUpdate = true;
            SyncOptions syncOptions = new SyncOptions();
            syncOptions.setForceUpdate(forceUpdate);
            String syncResult = newClient.sync(syncFile,syncOptions).toString();
            p4SanityMap.put("syncResult", syncResult);

            List<IFileSpec> filePathsWithoutRevs = new ArrayList<>();
            for (IFileSpec fileSpec : syncFile) {
                String filePath = fileSpec.toString();
                // Remove revision part after '#'
                IFileSpec filePathWithoutRev = new FileSpec(filePath.replaceAll("#\\d+", ""));
                filePathsWithoutRevs.add(filePathWithoutRev);
            }

            //P4 Edit a File
            Changelist changeListImpl = new Changelist(
                    IChangelist.UNKNOWN,
                    newClient.getName(),
                    (String) p4SanityData.get("user"),
                    ChangelistStatus.NEW,
                    new Date(),
                    "New changelist created by P4Java for Sanity",
                    false,
                    (Server) server
            );


            IChangelist changelist = newClient.createChangelist(changeListImpl);

            EditFilesOptions editFilesOptions = new EditFilesOptions().setChangelistId(changelist.getId());

            // Create a list of filespecs for files to be edited

            List<IFileSpec> editList = newClient.editFiles(filePathsWithoutRevs,editFilesOptions);

            String editResult =  editList.getFirst().toString();
            //Editing a File
            String[] parts = editResult.split("/");
            ArrayList<String> fileParts = new ArrayList<>();
            Collections.addAll(fileParts, parts);
            String filePath = "C:\\Users\\ulaga\\Logeshwaran\\BITS PROJECT\\p4javaWorkspace\\"+fileParts.getLast();
            StringBuilder content = new StringBuilder();
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");  // Read each line and append
            }
            reader.close();

            // Step 2: Modify the content (add new text, for example)
            String newText = "P4 Sanity Test"+formattedDateTime;
            content.append(newText);  // Append new text at the end

            // Step 3: Write the modified content back to the file
            BufferedWriter writer = new BufferedWriter(new FileWriter(filePath));
            writer.write(content.toString());  // Write the entire modified content
            writer.close();


            // Log files that are being edited
            for (IFileSpec fileSpec : editList) {
                if (fileSpec == null) {
                    System.err.println("Changelist contained a null filespec");
                    continue;
                }
                if (fileSpec.getOpStatus() == FileSpecOpStatus.VALID) {
                    System.out.println("edited: " + fileSpec);
                } else {
                    System.err.println(fileSpec.getStatusMessage());
                }
            }

            // Update changelist so to contain edited files that are added on line 79
            changelist.update();

            // Submit changelist
            List<IFileSpec> submitFiles = changelist.submit(false);
            if (submitFiles == null) {
                System.err.println("Failed to submit changelist");

            }

            // Log result of changelist submit
            for (IFileSpec fileSpec : submitFiles) {
                if (fileSpec == null) {
                    System.err.println("Submitted files contained null filespec");
                    continue;
                }
                if (fileSpec.getOpStatus() == FileSpecOpStatus.VALID) {
                    System.out.println("submitted: " + fileSpec);
                } else if (fileSpec.getOpStatus() == FileSpecOpStatus.INFO) {
                    System.out.println(fileSpec.getStatusMessage());
                } else if (fileSpec.getOpStatus() == FileSpecOpStatus.ERROR) {
                    System.err.println(fileSpec.getStatusMessage());
                }
            }

        } catch (P4JavaException | URISyntaxException e) {
            System.err.println("Error: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return p4SanityMap;
    }

}
