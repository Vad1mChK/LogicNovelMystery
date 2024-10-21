//package ru.itmo.lnm.backend;
//
//import org.junit.jupiter.api.Test;
//
//import java.sql.Connection;
//import java.sql.SQLException;
//
//import static org.assertj.core.api.Assertions.fail;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//
//public class JunitTest {
//    @Test
//    public void testConnectionSuccess() {
//        String url = "jdbc:postgresql://localhost:5432/labWeb3";
//        String user = "postgres";
//        String password = "1234";
//        Connection conn = null;
//        try {
//            conn = ConnectionDB.connect(url, user, password);
//            assertNotNull(conn, "Connection should not be null");
//            System.out.println("Successfully connected to the database.");
//        } catch (ClassNotFoundException e) {
//            fail("PostgreSQL JDBC Driver not found: " + e.getMessage());
//        } catch (SQLException e) {
//            fail("SQL Exception occurred: " + e.getMessage());
//        } finally {
//            try {
//                if (conn != null && !conn.isClosed()) {
//                    conn.close();
//                }
//            } catch (SQLException e) {
//                e.printStackTrace();
//            }
//        }
//    }
//}