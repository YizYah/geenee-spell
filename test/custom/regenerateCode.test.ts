import test from 'ava'

import {regenerateCode} from '../../src/custom/regenerateCode'
const mockFs = require('mock-fs')
const {getNsInfo} = require('magicalstrings').nsFiles
const fs = require('fs-extra')
const path = require('path')

/*
  The following test makes sure that the essential geenee functionality is in place.

  Basic custom test regeneration:
    * custom code gets inserted
    * code modified outside of custom areas gets deleted
    * new empty custom section gets added
    * new default custom section gets added
    * default does not override original
    * new files are generated
    * extra files (added unsafely) are deleted
    * files in custom areas remain

  Copying over from Starter
    * extra files in the starter should be copied over
    * ignored items are properly overwritten by the user version
    * an ignored item not included in the user version is created
    * new package.json gets added
    * additions to devs get added
    * lower versions of devs in starter are ignored
    * higher versions of devs in starter are adopted
    * omissions in starter dependencies are not removed
    * updates to non-dependencies are added
    * additions to non-dependencies are maintained
    * new package.json non-dependencies are added
    * package.json non-dependencies added by the user are maintained

 */
test('check Config', async t => {
  const SAMPLE_CODE = 'sampleCode'
  const codeDir = __dirname + '/' + SAMPLE_CODE

  mockFs({
    [SAMPLE_CODE]: mockFs.load(codeDir),
    [SAMPLE_CODE+'.starter']: mockFs.load(codeDir + '.starter'),
    // [SAMPLE_CODE+'.backup']: mockFs.directory,
    ['otherSampleCode']: mockFs.load(__dirname + '/otherSampleCode'),
    'node_modules': mockFs.load(path.resolve(__dirname, '../../node_modules')),
  })


  /*
        *************************
           Custom Regeneration
        *************************
   */


  // ensure that extra file exists
  let tempFileExists = await fs.pathExists(SAMPLE_CODE + '/temp.txt')
  t.true(tempFileExists)

  // ensure that new file does not exist
  let newFileExists = await fs.pathExists(SAMPLE_CODE + '/new.txt')
  t.false(newFileExists)


  await regenerateCode(
    SAMPLE_CODE, {},null,
  )

  // check whether a custom string got restored
  const customString='sample custom entry'
  const fullCustomSection='/* ns__custom_start beginning */' +
    customString +
    '/* ns__custom_end beginning */'

  const indexFile = await fs.readFile(SAMPLE_CODE + '/src/index.ts')
  t.true(indexFile.includes(fullCustomSection))


  // check whether an unsafe modification got removed
  const unsafeString='sample entry outside custom areas'
  t.false(indexFile.includes(unsafeString))

  // check for an added custom section (not previously in the code)
  const addedSectionName = 'added'
  const addedCustomSection = `/* ns__custom_start ${addedSectionName} */\n` +
    `/* ns__custom_end ${addedSectionName} */\n`
  t.true(indexFile.includes(addedCustomSection))

  // check change from default
  const originalCustomVersion='/* ns__custom_start export */' +
    'I did it myyyyyyyyyyyyy way' +
    '/* ns__custom_end export */'
  t.true(indexFile.includes(originalCustomVersion))

  // check missing default added
  const missingDefault='/* ns__custom_start default */meow/* ns__custom_end default */'
  t.true(indexFile.includes(missingDefault))

  // check whether new file created
  newFileExists = await fs.pathExists(SAMPLE_CODE + '/new.txt')
  t.true(newFileExists)

  //check whether extra file added unsafely gets deleted
  tempFileExists = await fs.pathExists(SAMPLE_CODE + '/src/temp.txt')
  t.false(tempFileExists)

  // check whether extra file in a custom area is retained
  const customFileExists = await fs.pathExists(SAMPLE_CODE + '/src/custom/temp.ts')
  t.true(newFileExists)


  /*
        *************************
        Copying over from Starter
        *************************
   */

  // * extra files in the starter should be copied over
  t.true(await fs.pathExists(SAMPLE_CODE + '/extraStarterFile.txt'))


  //TODO
  // * ignored items are properly overwritten by the user version

  //TODO
  // * an ignored item not included in the user version is created



  // * new package.json gets added
  t.true(await fs.pathExists(SAMPLE_CODE + '/package.json'))


  // fs.readdir(SAMPLE_CODE + '/node_modules', (err: any, files: any) => {
  //   files.forEach((file: any) => {
  //     console.log(file);
  //   });
  // });

  // // regenerate again, this time with an original package.json
  await fs.copy('otherSampleCode/package.json',SAMPLE_CODE + '/package.json')
  await regenerateCode(
    SAMPLE_CODE, {},null,
  )
  const codeJson = await fs.readJson(SAMPLE_CODE + '/package.json')

  // test whether template generated packageJsonInfo is overriding original
  t.is(codeJson.name, 'enteredName')

  // const starterJson = await fs.readJson(SAMPLE_CODE + '.starter/package.json')


  // const tempFile = await fs.readFile(SAMPLE_CODE + '/temp.txt')
  // console.log(`tempFile=${tempFile}`)
  //

  // // * additions to devs get added
  // t.true(await fs.pathExists(SAMPLE_CODE + '/package.json'))

  // * lower versions of devs in starter are ignored
  t.is(codeJson.devDependencies['cogs-box'], '^1.2.0')

  // * higher versions of devs in starter are adopted
  t.is(codeJson.dependencies.barbells, '^1.3.0')

  // * omissions in starter dependencies are not removed
  t.is(codeJson.dependencies.magicalstrings, '^0.0.14')
  t.is(codeJson.devDependencies['dynamapping'], '^1.6.0')

  // * non-dependencies added by the user are maintained
  t.is(codeJson.newUserAddedKey, 'peace')
  t.is(codeJson.scripts.fake, 'addedByMe')

  //NOTE: this requirement violates the one above that user changes are overwritten
  // by the general packageJsonInfo of the template.  This is perhaps the hardest
  // judgment call of the package (really, it's a geenee-rate judgment call).  On
  // the one hand, users will be annoyed when their change their package.json and it
  // gets overwritten.  On the other hand, the whole point of geenee is that changes
  // to the specs (or a template) will result in updated code.  The second point seems
  // more compelling.
  //
  // // * updates to non-dependencies by the user are maintained
  // t.is(codeJson.main, 'userMain')
  // t.is(codeJson.scripts.build, 'userVersion')

  mockFs.restore()
});
