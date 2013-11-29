test:
	@node node_modules/.bin/mocha test

test-cov:
	@node node_modules/.bin/istanbul cover node_modules/.bin/_mocha

.PHONY: test test-cov