public class MiniChallengeVulnerable {
    public static void main(String[] args) {
        String userInput = "admin' OR '1'='1";
        String query = "SELECT * FROM users WHERE username = '" + userInput + "'";
        System.out.println("Executing query: " + query);
        // Simulate execution (in real code, this would be a database call)
    }
} 