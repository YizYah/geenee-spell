
[//]: # ( ns__file unit: standard, comp: README.md )

[//]: # ( ns__custom_start beginning )

![geenee-spell](src/custom/images/geenee-spell-new.gif)

[//]: # ( ns__custom_end beginning )

[//]: # ( ns__start_section intro )

[//]: # ( ns__custom_start description )
regenerates code in a project based upon a template and a settings file.

[//]: # ( ns__custom_end description )

[//]: # ( ns__custom_start afterDescription )

[//]: # ( ns__custom_end afterDescription )

[//]: # ( ns__custom_start badges )


[//]: # ( ns__start_section usageSection )

[![codecov](https://codecov.io/gh/YizYah/geenee-spell/branch/main/graph/badge.svg?token=DF6B2CCSUP)](https://codecov.io/gh/YizYah/geenee-spell)
[![Version](https://img.shields.io/npm/v/geenee-spell.svg)](https://npmjs.org/package/geenee-spell)
[![Downloads/week](https://img.shields.io/npm/dw/geenee-spell.svg)](https://npmjs.org/package/geenee-spell)
[![License](https://img.shields.io/npm/l/geenee-spell.svg)](https://github.com/YizYah/geenee-spell/blob/master/package.json)


A [geenee](https://www.npmjs.com/package/geenee) code base contains a `meta` directory, which should have a `template` and a settings file called `ns.yml`.  This package exposes a single async function that can regenerate the whole code base from scratch when your template and/or settings have changed.

You probably won't need to use this package directly.  It gets included by geenee and [copykat](https://www.npmjs.com/package/copykat). 

[//]: # ( ns__custom_end badges )

[//]: # ( ns__end_section intro )


[//]: # ( ns__start_section api )


[//]: # ( ns__custom_start APIIntro )
# Usage
Install 
```
npm i geenee-spell
```
Then you can generate code by specifying a package.  The simplest usage is like this:
```
const generateCode = require('geenee-spell')

(async () => {
	await generateCode('~/packages/myPackage', {}, null)
})();
```
[//]: # ( ns__custom_end APIIntro )


[//]: # ( ns__custom_start constantsIntro )

[//]: # ( ns__custom_end constantsIntro )



[//]: # ( ns__start_section types )


[//]: # ( ns__end_section types )


[//]: # ( ns__end_section api )

