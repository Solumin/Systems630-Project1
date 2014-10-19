#{'a':1}

# test POP_TOP
# lambda:1
# print (lambda:1)()

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

# x = range(6)
# x[2:4] += 'abc'
# print x

# a=[1,2,3]

# b = [ i**2 for i in a ]
# print b

# c = [ i**2 for i in a if i > 2]
# print c
