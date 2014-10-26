def test(testVal, refVal, name):
    if (testVal != refVal):
        print "FAILED: " + name
        print "\tRESULT: ", testVal, " != ", refVal
        return 0
    else:
        print "passed: " + name
        return 1

x = 5.0
passed = 0
total = 10

# Basic math
passed = passed + test(x + 1.0, 6.0, "Basic addition (5.0 + 1.0 = 6.0)")
passed = passed + test(x + (-2.0), 3.0, "Negative addition (5.0 + (-2.0) = 3.0)")
passed = passed + test(x - 1.0, 4.0, "Basic subtraction (5.0 - 1.0 = 4.0)")
passed = passed + test(x * 3.0, 15.0, "Basic multiplication (5.0 * 3.0 = 15.0)")
passed = passed + test(x // 2.0, 2.0, "Floor division (5.0 // 2.0 = 2.0)")
passed = passed + test(x / 2, 2.5, "Normal division (5.0 / 2.0 = 2.5)")
passed = passed + test(x / 2.0, 2.5, "Floating division (5.0 / 2.0 = 2.5)")
passed = passed + test(x % 2.0, 1.0, "Basic modulo (5.0 % 2.0 = 1.0)")
passed = passed + test(x ** 4.0, 625.0, "Positive power (5.0 ** 4.0 = 625.0)")
passed = passed + test(x ** -2.0, 0.04, "Negative power (5 ** -2.0 = 0.04)")

print "Passed ", passed, "/", total, " tests"
