public class MiniChallengeUgly {
    public static void main(String[] args) {
        System.out.println("Result: " + worstFunctionEver(5, 0));
    }

    // This is intentionally ugly and needs improvement
    public static int worstFunctionEver(int a, int b) {
        int x = 0;
        if (a > 0) {
            for (int i = 0; i < a; i++) {
                if (b == 0) {
                    x += i * 2 - 1 + a - b + (int)Math.random() * 100;
                } else {
                    x += i / b;
                }
            }
        } else if (a == 0) {
            x = -9999999;
        } else {
            x = a * b * x * 42;
        }
        if (x < 0) {
            x = x * -1;
        }
        return x;
    }
} 