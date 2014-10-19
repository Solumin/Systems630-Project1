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

# all:

test: $(TESTJS) $(EXSOURCES)

$(TESTJS): $(TEST) $(TSSOURCES)
	@echo
	@echo Compiling $(TESTJS)
	$(TSC) $(TSCFLAGS) $(TEST)

# $(JSSOURCES): $(TSSOURCES)
# 	$(TSC) $(TSCFLAGS) $^

%.js: %.ts
	$(TSC) $(TSCFLAGS) $^

# $(EXSOURCES): $(PYSOURCES)
# 	@echo
# 	@echo Compiling all python sources files in $(EDIR)/
# 	$(PYC) $?

%.pyc: %.py
	$(PYC) $^

.PHONY: clean clean-src clean-ex clean-test

clean-src:
	@echo
	@echo Cleaning $(SDIR)/ JS files
	$(RM) $(JSFILE) $(JSSOURCES)

clean-ex:
	@echo
	@echo Cleaning $(EDIR)/ PYC files
	$(RM) $(EXSOURCES)

clean-test: clean-ex
	@echo
	@echo Cleaning $(TESTJS)
	$(RM) $(TESTJS)

clean: clean-test clean-src clean-ex

