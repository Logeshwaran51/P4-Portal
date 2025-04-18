package com.backend.Self_help.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.stereotype.Component;


@Component
@Document(collection = "ServerDB")
public class ServerModel {

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    private String _id;
    private String server;

}
