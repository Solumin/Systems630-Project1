# Typescript compiler
TSC=tsc
TSCFLAGS=--module commonjs
# Name of target "main application" file
BASE=test
## Different filetypes that use base file name
TSFILE=$(BASE).ts
JSFILE=$(BASE).js
# Source files:
TSSOURCES=interpreter.ts unmarshal.ts codeobject.ts frameobject.ts \
	  funcobject.ts supportobjects.ts
JSSOURCES=$(TSSOURCES:.ts=.js)

all: $(TSSOURCES) $(JSFILE)

$(JSFILE): $(TSFILE) $(TSSOURCES)
	$(TSC) $(TSCFLAGS) $(TSFILE)

.PHONY: clean

clean:
	rm $(JSFILE) $(JSSOURCES)

# The main application file, $(BASE).js, depends on $(BASE).ts, which in turn
# depends upon all of the other .ts files in the source. Those all need to be
# compiled into .js files, too. However, TSC automatically does that for us.
# I think that means we just need to make $(BASE).js depend upon $(BASE).ts and
# all of the source .js files, then have a rule for those.
