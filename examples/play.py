
# test POP_TOP
lambda:1
print (lambda:1)()

# test ROT_TWO
a = 1; b = 2
(a, b) = (b, a)
print a

#test ROT_THREE
#TODO: make it a bit more meaningfull
a = 1
(a, a, a) = (a, a, a)

#test UNARY positive and negative
b = -3
a = 2

a = +a
c = -a
b = +b
d = -b

print a, c, b, d

#test UNARY not and invert
a = 0
print "a =",a
print not a

b = 12
print ~b

#test BINARY divide, power and modulo
a = 5.5 / 2

b = 3 ** 4

c = 8%3

print a, b, c

#test BINARY subtract, subscr, floor_divide, BUILD_LIST

a = 6
a = a - 2
print a

c = 7.2
print c

c = c // 2
print c

b = [1,2,3,4]
print b

#test STORE_subscr and DELETE_subscr

a = [1,2,3]
print a
a[1] = 5
print a
del a[1]
print a

#test BINARY and, or, xor, lshift, rshift

a = 5
b = 1
print a & b
print a | b
print a ^ b
print a << b	
print a >> b

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
