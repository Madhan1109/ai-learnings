/*
Solution: Added professional Javadoc documentation and a usage example for the previously undocumented and confusing function 'm'.
*/
public class MiniChallengeConfusingFixed {
    public static void main(String[] args) {
        System.out.println(m(3, 2));
    }

    /**
     * Computes the binomial coefficient (x + y - 1 choose y), also known as combinations with repetition.
     * <p>
     * This function calculates the number of ways to choose y items from x types with repetition allowed.
     *
     * @param x the number of types (must be >= 0)
     * @param y the number of items to choose (must be >= 0)
     * @return the number of combinations with repetition
     *
     * <b>Usage Example:</b>
     * <pre>
     *     int result = MiniChallengeConfusingFixed.m(3, 2);
     *     // result will be 6
     * </pre>
     */
    public static int m(int x, int y) {
        int z = 1;
        for (int i = 0; i < y; i++) {
            z = z * (x + i) / (i + 1);
        }
        return z;
    }
} 