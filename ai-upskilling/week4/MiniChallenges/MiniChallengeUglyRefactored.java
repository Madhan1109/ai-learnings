/*
Improvements made in this refactored version:
1. Removed nondeterminism and magic numbers: Eliminated use of Math.random() and arbitrary constants like -9999999 and 42.
2. Handled division by zero: The function now safely avoids division by zero and uses a predictable calculation when b == 0.
3. Improved readability and structure: Added comments, used clearer variable names, and simplified logic for maintainability.
*/
public class MiniChallengeUglyRefactored {
    public static void main(String[] args) {
        System.out.println("Result: " + improvedFunction(5, 0));
    }

    /**
     * Calculates a value based on the input parameters a and b.
     * <p>
     * If a > 0, sums either (i + a - b) for each i in [0, a) if b == 0, or (i / b) otherwise.
     * If a == 0, returns 0. If a < 0, returns the absolute value of (a * b).
     * Always returns a non-negative result.
     *
     * @param a an integer input that determines the loop range and result logic
     * @param b an integer input that affects the calculation and division
     * @return the calculated non-negative integer result
     *
     * <b>Usage Example:</b>
     * <pre>
     *     int result = MiniChallengeUglyRefactored.improvedFunction(5, 0);
     *     // result will be 35
     * </pre>
     */
    public static int improvedFunction(int a, int b) {
        int result = 0;
        if (a > 0) {
            for (int i = 0; i < a; i++) {
                if (b == 0) {
                    // Instead of random and magic numbers, just sum i and a
                    result += i + a - b;
                } else {
                    result += i / b; // b is not zero here
                }
            }
        } else if (a == 0) {
            result = 0; // Use 0 instead of a magic negative number
        } else {
            result = a * b; // Remove unnecessary multiplication and magic number
        }
        // Return absolute value
        return Math.abs(result);
    }
} 