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
	
test: $(TESTJS) $(EXSOURCES)

$(TESTJS): $(TEST) $(TSSOURCES)
	$(TSC) $(TSCFLAGS) $(TEST)

$(JSSOURCES): $(TSSOURCES)
	$(TSC) $(TSCFLAGS) $^

%.js: %.ts
	$(TSC) $(TSCFLAGS) $^

$(EXSOURCES): $(PYSOURCES)
	$(PYC) $^

%.pyc: %.py
	$(PYC) $^

.PHONY: clean clean-src clean-ex clean-test

clean-src:
	$(RM) $(JSFILE) $(JSSOURCES)

clean-ex:
	$(RM) $(EXSOURCES)

clean-test: clean-ex
	$(RM) $(TESTJS)

clean: clean-test clean-src clean-ex

