def test(testVal, refVal, name):
    if (testVal != refVal):
        print "FAILED: " + name
        print "\tRESULT: ", testVal, " != ", refVal
    else:
        print "passed: " + name

def foo(x = 1, y = 2, z = 3):
    return x + y + z

test(foo(), 6, "No arguments")
test(foo(x = 9), 14, "x has argument")
test(foo(y = 18), 22, "y has argument")
test(foo(z = -1.0), 2.0, "z has argument")
test(foo(x = 4, y = 64L), 71, "x and y have arguments")
test(foo(z = -200.0, x = 0), -198.0, "z and x have arguments (reversed)")
test(foo(x = 3, y = 10.5, z = 11), 24.5, "All 3 have arguments")
test(foo(z = 12.9, x = 3, y = -30), -14.1,
    "All 3 have arguments (scrambled order)")
