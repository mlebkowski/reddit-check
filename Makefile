all:
	rm -fr app.zip
	zip -r app.zip . -x ".git/*" -x ".idea/*" -x Makefile
