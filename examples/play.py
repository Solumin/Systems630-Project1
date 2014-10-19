
# test POP_TOP
lambda:1
print "Pop lambad:1 = ", (lambda:1)()

# test ROT_TWO
a = 1; b = 2
(a, b) = (b, a)
print "After (a,b) = (2,1), a = ", a

#test ROT_THREE
#TODO: make it a bit more meaningfull
a = 1
(a, a, a) = (a, a, a)

#test UNARY positive and negative
a = 2
b = -3

a = +a
c = -a
b = +b
d = -b

print "+(2) = ", a
print "-(2) = ", c
print "+(-3) = ", b
print "-(-3) = ", d

#test UNARY not and invert
a = 0
print "a = ", a
print "not a = ", not a

b = 12
print "~12 = ", ~b

#test BINARY divide, power and modulo
a = 5.5 / 2

b = 3 ** 4

c = 8%3

print "5.5 / 2 = ", a
print "3 ** 4 = ", b
print "8 % 3 = ", c

#test BINARY subtract, subscr, floor_divide, BUILD_LIST

a = 6
a = a - 2
print "6 - 2 = ", a

c = 7.2 // 2
print "7.2 // 2 = ", c

b = [1,2,3,4]
print "A simple list: ", b

#test STORE_subscr and DELETE_subscr

print
a = [1,2,3]
print "Starting list: ", a
a[1] = 5
print "a[1] = 5 => ", a
del a[1]
print "del a[1] => ", a

#test BINARY and, or, xor, lshift, rshift

a = 5
b = 1
print "5 & 1 = ", a & b
print "5 | 1 = ", a | b
print "5 ^ 1 = ", a ^ b
print "5 << 1 = ", a << b	
print "5 >> 1 = ", a >> b

#test BUILD_map

# {'a':1}


# a = []
# a.append(1)

# #test inplace operations
# a = 1
# b = 1
# a += 2
# b = b + 2

# print a
# print b

# x = range(6)
# x[2:4] += 'abc'
# print x

# # a=[1,2,3]

# # b = [ i**2 for i in a ]
# # print b

# # c = [ i**2 for i in a if i > 2]
# # print c
