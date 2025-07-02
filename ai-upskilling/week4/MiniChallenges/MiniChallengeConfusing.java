public class MiniChallengeConfusing {
    public static void main(String[] args) {
        System.out.println(m(3, 2));
    }

    // No documentation, confusing logic
    public static int m(int x, int y) {
        int z = 1;
        for (int i = 0; i < y; i++) {
            z = z * (x + i) / (i + 1);
        }
        return z;
    }
} 