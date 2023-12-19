const { exec } = require('child_process');
const address = 'DU2eN4xnkLfo69SKRpd8DzUUxH1iWFu5pV';

// const toProccess = ['youtube', 'linux', 'windows', 'apple', 'lambo', 'f1', 'hack', 'evil', 'sun', 'swap', 'mint', 'transfer', 'deploy', 'inscribe', 'lazo', 'eric', 'hallo', 'hello', 'hell', 'sky', 'accept', 'send', 'receive', 'handles', 'wallet', 'pocket', 'market', 'marketplace', 'saw', 'fast'];
// const toProccess = ['doge', 'elon', 'jack', 'bitcoin', 'doginals', 'ethereum', 'binance', 'founder', 'owner', 'welcome', 'gm', 'pump', 'bull', 'moon', 'mars', 'go', 'oifi', 'dogi', 'handle', 'cz']
// const iuhihg = ['coin', 'john', 'whale']
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
let toProccess = [];

for (let i = 817; i < 1000; i++) {
    toProccess.push(i);
}



function executeMint(textContent) {
    return new Promise((resolve, reject) => {
        const content = Buffer.from(`@${textContent}`, 'utf-8').toString('hex');
        const command = `cd ../inscription-wallet && ` +
            `node . mint ${address} "text/plain;charset=utf-8" ${content}`;

        exec(command, (error, res, err) => {
            if (error) {
                reject(error);
            } else {
                resolve(res);
            }
        });
    });
}

async function mintAll() {
    for (const textContent of toProccess) {
        try {
            const result = await executeMint(textContent);
            console.log(`Command output: ${result}`);
            console.log(`@${textContent} Minted`);
        } catch (error) {
            console.error(`Error : ${error}`);
        }
    }
}

mintAll()
    .then(() => {
        console.log('All mints completed');
    })
    .catch((error) => {
        console.error('Error in minting:', error);
    });
