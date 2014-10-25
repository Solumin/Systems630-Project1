def test(x, y, name):
    if (x != y):
        print "FAILED: " + name
    else:
        print "PASSED: " + name

x = 5
# Basic math
test(x + 1, 6, "Basic addition (5 + 1 = 6)")
test(x + (-2), 3, "Negative addition (5 + (-2) = 3")
test(x - 1, 4, "Basic subtraction (5 - 1 = 4")
test(x * 3, 15, "Basic multiplication (5 * 3 = 15)")
test(x // 2, 2, "Floor division (5 // 2 = 2)")
test(x / 2, 2.5, "Normal division (5 / 2 = 2.5")
test(x % 2, 1, "Basic modulo (5 % 2 = 1")
test(x ** 4, 625, "Positive power (5 ** 4 = 625")
test(x ** -2, 0.04, "Negative power (5 ** -2 = 0.04")
test(x << 2, 20, "Left shift (5 << 2 = 20")
test(x >> 2, 1, "Right shift (5 >> 2 = 1")
test(x & 3, 1, "Bitwise AND (5 & 3 = 1")
test(x | 19, 23, "Bitwise OR (5 | 19 = 23")
test(x ^ 14, 11, "Bitwise XOR (5 ^ 14 = 11")
test(~x, -6, "Inversion (~5 = -6)")
