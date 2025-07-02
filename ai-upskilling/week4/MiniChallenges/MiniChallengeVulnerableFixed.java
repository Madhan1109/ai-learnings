/*
Solution: The original code was vulnerable to SQL injection because it directly concatenated user input into the SQL query. This fix uses parameterized queries (PreparedStatement) to safely handle user input and prevent SQL injection attacks.
*/
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class MiniChallengeVulnerableFixed {
    public static void main(String[] args) {
        String userInput = "admin' OR '1'='1";
        String query = "SELECT * FROM users WHERE username = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:yourdb", "user", "pass");
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setString(1, userInput);
            System.out.println("Executing query safely with parameterized input.");
            // stmt.executeQuery(); // Uncomment in real code
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
} 