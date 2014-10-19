# Typescript compiler
TSC=tsc
TSCFLAGS=--module commonjs
# Python 2.7 "compiler"
PYC=python2.7 -m compileall
# Source and Example directory
SDIR=src
EDIR=examples
# Source files:
TSSOURCES=$(wildcard $(SDIR)/*.ts)
JSSOURCES=$(TSSOURCES:.ts=.js)
# Example files:
PYSOURCES=$(wildcard $(EDIR)/*.py)
EXSOURCES=$(PYSOURCES:.py=.pyc)
# Test application file:
TEST=test.ts
TESTJS=test.js

# all: $(TSSOURCES) $(JSFILE)
	
test: $(TESTJS)

$(TESTJS): $(TEST) $(TSSOURCES) $(EXSOURCES)
	$(TSC) $(TSCFLAGS) $(TEST)

%.js: %.ts
	$(TSC) $(TSCFLAGS) $^

$(EXSOURCES): $(PYSOURCES)
	$(PYC) $^

%.pyc: %.py
	$(PYC) $^

.PHONY: clean

clean-src:
	$(RM) $(JSFILE) $(JSSOURCES)

clean-ex:
	$(RM) $(EXSOURCES)

clean: clean-src clean-ex

# The main application file, $(BASE).js, depends on $(BASE).ts, which in turn
# depends upon all of the other .ts files in the source. Those all need to be
# compiled into .js files, too. However, TSC automatically does that for us.
# I think that means we just need to make $(BASE).js depend upon $(BASE).ts and
# all of the source .js files, then have a rule for those.
