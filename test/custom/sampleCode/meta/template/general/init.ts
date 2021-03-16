
module.exports = {
    init: async function(command: string, codeDir: string){
        const defaultProjectName = 'defaultName'
        const session = {
            notWin: process.platform !== "win32",
            userName: 'TheUser',
            defaultProjectName,
        }

        return session

    },

}
