import marshal

class Foo:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def toString():
        return "(%d, %d)" % [x,y]

print(marshal.dumps(Foo))
