package com.backend.Self_help.controller;

import com.backend.Self_help.service.P4LabelsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class P4LabelController {

    @Autowired
    P4LabelsService p4Label;

    @PostMapping("/labels")
    public Map<String, ArrayList<String>> listLabel(@RequestBody Map<String, ?> listLabels) {
        return p4Label.listAllLabels(listLabels);
    }

    @PostMapping("/labelsReloadList")
    public Map<String, ArrayList<String>> listReloadLabel(@RequestBody Map<String, ?> listReloadLabels) {
        return p4Label.listAllReloadLabels(listReloadLabels);
    }

    @DeleteMapping("/labelDelete")
    public ArrayList<String> deleteLabels(@RequestBody Map<String, ?> deleteLabelsList) {
        return p4Label.deleteLabels(deleteLabelsList);
    }

    @PostMapping("/labelUnload")
    public ArrayList<String> unloadLabels(@RequestBody Map<String, ?> unloadLabelsList) {
        return p4Label.unloadLabels(unloadLabelsList);
    }

    @PostMapping("/labelReload")
    public ArrayList<String> reloadLabels(@RequestBody Map<String, ?> reloadLabelsList) {
        return p4Label.reloadLabels(reloadLabelsList);
    }


}
