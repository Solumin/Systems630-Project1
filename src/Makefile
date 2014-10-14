# Typescript compiler
TSC=tsc
TSCFLAGS=--module commonjs
# Name of file
BASE=unmarshal
## Different filetypes that use base file name
TSFILE=$(BASE).ts
JSFILE=$(BASE).js

ALLFILES=$(TSFILE) $(JSFILE)

all: $(ALLFILES)

$(JSFILE): $(TSFILE)
	$(TSC) $(TSCFLAGS) $(TSFILE)

.PHONY: clean

clean:
	rm $(JSFILE)
