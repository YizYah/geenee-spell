const {dirNames, fileNames, suffixes} = require('magicalstrings').constants
const {getNsInfo} = require('magicalstrings').nsFiles
const {getConfig} = require('magicalstrings').configs
const {storeCustomCode, insertCustomCode} = require('custom-jeans')

const {copyCodeBaseToNewDir} = require('magicalstrings').copyCodeBaseToNewDir
const {moveOverIgnored} = require('magicalstrings').moveOverIgnored
import {createSpecElement} from './specs/specCreation/createSpecElement'
import {updatePackageJson} from './packageJson/updatePackageJson'

const fs = require('fs-extra')
const {setNsInfo} = require('magicalstrings').nsFiles
const generateCode = require('geenee-rate')

export async function regenerateCode(
  codeDir: string, session: any, sourceLocation: string|null
) {
  const sourceCodeDir = sourceLocation || codeDir

  const starter = `${sourceCodeDir}${suffixes.STARTUP_DIR}`
  const backupDir = `${sourceCodeDir}${suffixes.BACKUP_DIR}`

  const originalMetaDir = `${sourceCodeDir}/${dirNames.META}`
  const templateDir = `${originalMetaDir}/${dirNames.TEMPLATE}`
  const config = await getConfig(templateDir)

  const metaDir = `${codeDir}/${dirNames.META}`

  if (sourceLocation) {
    // this is a test generation (for checking the code) in a different directory
    try {
      await fs.remove(codeDir)
      await copyCodeBaseToNewDir(starter, codeDir)
      await moveOverIgnored(
        sourceCodeDir, codeDir, config
      )
    } catch (error) {
      throw new Error(`cannot get test dir set up: ${error}`)
    }
  }
  const nsInfo = await getNsInfo(codeDir)

  // const customCodeJson = await storeCustomCode(sourceCodeDir, config)

  if (!starter) throw new Error(`the '${fileNames.NS_FILE}' file contains no starter.  ` +
    'You need a starter to generate code.')

  try {
    const {general} = config
    let generalSettings = nsInfo.general || {}

    if (Object.keys(generalSettings).length === 0) generalSettings = await createSpecElement(general, session)
    nsInfo.general = generalSettings
    await setNsInfo(codeDir, nsInfo)
    await storeCustomCode(sourceCodeDir, config)

    // replace the backup
    await fs.remove(backupDir)
    await copyCodeBaseToNewDir(codeDir, backupDir)
  } catch (error) {
    throw new Error(`could not generate the code: ${error}`)
  }

  // regenerate the code
  try {
    await fs.remove(codeDir)
    await copyCodeBaseToNewDir(starter, codeDir)
  } catch (error) {
    throw new Error(`could not copy code base: ${error}`)
  }

  try {
    await moveOverIgnored(
      backupDir, codeDir, config
    )

    // copy over backed up package.json
    const codePackageJsonPath = `${codeDir}/package.json`
    const backupPackageJsonPath = `${codeDir}${suffixes.BACKUP_DIR}/package.json`
    if (await fs.pathExists(backupPackageJsonPath)) {
      await fs.copy(backupPackageJsonPath, codePackageJsonPath)
    }

  } catch (error) {
    throw new Error(`could not move over ignored: ${error}`)
  }

  try {
    await generateCode(
      codeDir, nsInfo, config, templateDir, false
    )
  } catch (error) {
    throw new Error(`could not regenerate the code: ${error}`)
  }

  await new Promise(r => setTimeout(r, 1000))

  try {
    const customCodeDoc = `${metaDir}/${fileNames.CUSTOM_CODE_FILE}`
    await insertCustomCode(
      codeDir, customCodeDoc, config
    )
  } catch (error) {
    throw new Error(`could not insert custom code: ${error}`)
  }

  try {
    await updatePackageJson(
      codeDir, starter,
    )
  } catch (error) {
    throw new Error(`could not build json: ${error}`)
  }

}
