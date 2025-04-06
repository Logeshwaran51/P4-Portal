package com.backend.Self_help.service;
import com.perforce.p4java.exception.P4JavaException;
import com.perforce.p4java.server.IOptionsServer;
import com.perforce.p4java.server.IServerInfo;
import com.perforce.p4java.server.ServerFactory;
import lombok.Data;
import org.springframework.stereotype.Component;
import java.net.URISyntaxException;

@Component
public class PerforceService {

    private String SERVER_URI;
    private String USER_NAME;

    public String getUSER_NAME() {
        return USER_NAME;
    }

    public void setUSER_NAME(String USER_NAME) {
        this.USER_NAME = USER_NAME;
    }


    public String getSERVER_URI() {
        return SERVER_URI;
    }

    public void setSERVER_URI(String SERVER_URI) {
        this.SERVER_URI = "p4java://"+SERVER_URI;
    }


    public IOptionsServer getOptionsServer() throws P4JavaException, URISyntaxException {
        IOptionsServer server = ServerFactory.getOptionsServer(SERVER_URI, null, null);
        server.connect();
        server.setUserName(USER_NAME);
        return server;
    }
}
