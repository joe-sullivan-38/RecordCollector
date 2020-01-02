package com.joesullivan.recordcollector;

import java.sql.*;

public class DBConnect {
    public static void main(String args[]) {
        DBConnect dbConnect = new DBConnect();
        dbConnect.returnSet("select name from genre order by name");
        /*try {
            Statement stmt = dbConnect.dbConnect().createStatement();
            ResultSet rs = stmt.executeQuery("select name from genre order by name");
            while (rs.next())
                System.out.println(rs.getString(1));
            dbConnect.dbConnectClose(dbConnect.dbConnect());
        } catch (Exception e) {
            System.out.println(e);
        }*/
    }

    public Connection dbConnect() {
        {
            Connection con = null;
            try {
                con = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/recordcollector", "joe", "Leppard32");
                return con;
            } catch (Exception ex) {
                return con;
            }
        }
    }

    public void dbConnectClose(Connection con) throws SQLException {
        con.close();
    }

    public String[] returnSet(String query) {
        String[] returnSet = null;
        try {
            DBConnect dbConnect = new DBConnect();
            Statement stmt = dbConnect.dbConnect().createStatement();
            ResultSet rs = stmt.executeQuery(query);
            returnSet = new String[rs.getFetchSize()];


            int counter = 0;
            while (rs.next())
                returnSet[counter] = rs.getString(1);
            System.out.println(rs.getString(1));
            dbConnect.dbConnectClose(dbConnect.dbConnect());
        } catch (Exception e) {
            System.out.println(e);
        }
        return returnSet;
    }

    public int returnSetCount(String query) {

        try {
            DBConnect dbConnect = new DBConnect();
            Statement stmt = dbConnect.dbConnect().createStatement();
            ResultSet rs = stmt.executeQuery(query);
            int counter = 0;
            while (rs.next())
                return rs.getInt(1);
            dbConnect.dbConnectClose(dbConnect.dbConnect());
        } catch (Exception e) {
            System.out.println(e);
        }
        return 0;
    }
}