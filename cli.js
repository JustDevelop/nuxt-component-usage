#!/usr/bin/env node

const fsp = require('fs').promises
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const yargs = require('yargs')
const mergeObjectsWithArrayProperties = require('./utils/mergeObjectsWithArrayProperties')

const argv = yargs
  .option('componentsDirectory', {
    alias: 'c',
    description: 'Change the default path to the components directory',
    type: 'string'
  })
  .option('pagesDirectory', {
    alias: 'p',
    description: 'Change the default path to the pages directory',
    type: 'string'
  })
  .help()
  .alias('help', 'h')
  .argv

if (argv.time) {
  console.log('The current time is: ', new Date().toLocaleTimeString())
}

let componentsDirectory = '../../components/'
let pagesDirectory = '../../components/'

if (argv.componentsDirectory) {
  console.log('argv.componentsDirectory: ', argv.componentsDirectory)
  componentsDirectory = argv.componentsDirectory
}
if (argv.pagesDirectory) {
  console.log('argv.pagesDirectory: ', argv.pagesDirectory)
  pagesDirectory = argv.pagesDirectory
}

/**
 * Get directory files
 *
 * @param dir
 * @returns {Promise<unknown>}
 */
async function getDirectoryFiles (dir) {
  let files = await fsp.readdir(dir)
  files = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file)
    const stats = await fsp.stat(filePath)
    if (stats.isDirectory()) {
      return getDirectoryFiles(filePath)
    } else if (stats.isFile()) {
      return filePath
    }
  }))

  return files.reduce((all, folderContents) => all.concat(folderContents), [])
}

let components = {}

/**
 * Push occurrence
 *
 * @param occurrences
 * @param path
 * @param lineNumber
 * @returns {*}
 */
const pushOccurrence = (occurrences, path, lineNumber) => {
  const _occurrences = { ...occurrences }

  const alreadyOccurredOnce = Object.keys(_occurrences)
    .includes(path)

  if (alreadyOccurredOnce) {
    return { ..._occurrences, [path]: [..._occurrences[path], lineNumber] }
  } else {
    return { ..._occurrences, [path]: [lineNumber] }
  }
}

const checkPath = (components, path) => {
  const _components = { ...components }
  const numberOfComponents = Object.keys(_components).length

  return new Promise((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path),
      output: false,
      console: false
    })

    let lineNumber = 0
    readInterface.on('line', function (line) {
      lineNumber++

      return Object.entries(_components)
        .forEach((entry, index) => {
          const component = entry[1]

          const lowercaseNameWithDashes = component.name
          lowercaseNameWithDashes.replace(/[A-Z][a-z]*/g, str => '-' + str.toLowerCase() + '-')
          // Convert words to lower case and add hyphens around it (for stuff like "&")
            .replace('--', '-') // remove double hyphens
            .replace(/(^-)|(-$)/g, '') // remove hyphens at the beginning and the end

          const names = [`<${component.name}`, `<${lowercaseNameWithDashes}`]

          if (line.includes(names[0]) || line.includes(names[1])) {
            const componentPath = entry[0]

            _components[componentPath] = {
              ..._components[componentPath],
              count: _components[componentPath].count + 1,
              occurrences: pushOccurrence(_components[componentPath].occurrences, path, lineNumber)
            }
          }

          if (index === numberOfComponents - 1) {
            resolve(_components)
          }
        })
    })
  })
}

getDirectoryFiles(componentsDirectory)
  .then((componentPaths) => {
    componentPaths.forEach((componentPath) => {
      const splitByDot = componentPath.split('.')
        .slice(0, -1)
      const splitBySlash = splitByDot[splitByDot.length - 1].split('/')
      const name = splitBySlash[splitBySlash.length - 1]

      components[componentPath] = {
        name,
        count: 0,
        occurrences: {}
      }
    })

    console.log('Number of components: ' + Object.keys(components).length)

    getDirectoryFiles(pagesDirectory)
      .then((pagePaths) => {
        const numberOfPages = pagePaths.length

        console.log('Number of pages: ' + numberOfPages)

        let i = 0
        pagePaths.forEach((pagePath) => {
          console.log('pagePath', pagePath)

          checkPath(components, pagePath)
            .then((_components) => {
              const tempComponents = {}

              Object.entries(_components)
                .forEach((entry) => {
                  const componentPath = entry[0]
                  const component = entry[1]

                  tempComponents[componentPath] = {
                    ...components[componentPath],
                    count: components[componentPath].count + component.count,
                    occurrences: mergeObjectsWithArrayProperties(components[componentPath].occurrences, component.occurrences)
                  }
                })

              components = tempComponents

              console.log('done for pagePath: ' + pagePath)

              if (i >= numberOfPages - 1) {
                console.log('done for all page paths')

                //
                //
                //
                const numberOfComponents = Object.keys(components).length

                console.log('Number of components: ' + numberOfComponents)

                let ii = 0
                componentPaths.forEach((componentPath) => {
                  console.log('componentPath', componentPath)

                  checkPath(components, componentPath)
                    .then((_components) => {
                      const tempComponents = {}

                      Object.entries(_components)
                        .forEach((entry) => {
                          const componentPath = entry[0]
                          const component = entry[1]

                          tempComponents[componentPath] = {
                            ...components[componentPath],
                            count: components[componentPath].count + component.count,
                            occurrences: mergeObjectsWithArrayProperties(components[componentPath].occurrences, component.occurrences)
                          }
                        })

                      components = tempComponents

                      console.log('done for componentPath: ' + componentPath)

                      if (ii >= numberOfComponents - 1) {
                        console.log('done for all component paths')
                        console.table(components)
                      }

                      ii++
                    })
                })
                //
                //
                //
              }

              i++
            })
        })
      })
  })

console.log(argv)
