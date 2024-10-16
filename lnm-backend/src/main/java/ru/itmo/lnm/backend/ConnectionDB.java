package ru.itmo.lnm.backend;

import java.sql.DriverManager;

public class ConnectionDB {
    public static java.sql.Connection connect(String url, String user, String password) throws ClassNotFoundException, java.sql.SQLException {
        Class.forName("org.postgresql.Driver");
        return DriverManager.getConnection(url, user, password);
    }
}