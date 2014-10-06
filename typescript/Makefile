# Typescript compiler
TSC=tsc
# Name of file
BASE=test
## Different filetypes that use base file name
TSFILE=$(BASE).ts
JSFILE=$(BASE).js
HTMLFILE=$(BASE).html
ALLFILES=$(TSFILE) $(JSFILE) $(HTMLFILE)
# Title of page
TITLE=Typescript Test

all: $(ALLFILES)

$(HTMLFILE): $(JSFILE)
	echo "<! DOCTYPE html>" > $(HTMLFILE)
	echo "<html>" >> $(HTMLFILE)
	echo "<head><title>$(TITLE)</title></head>" >> $(HTMLFILE)
	echo "<body>" >> $(HTMLFILE)
	echo "<script src=\"./$(JSFILE)\"></script>" >> $(HTMLFILE)
	echo "</body>" >> $(HTMLFILE)
	echo "</html>" >> $(HTMLFILE)

$(JSFILE): $(TSFILE)
	$(TSC) $(TSFILE)

.PHONY: clean

clean:
	rm $(HTMLFILE) $(JSFILE)
