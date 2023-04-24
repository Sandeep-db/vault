
async function registerUser() {
    const form = document.forms['register-form']
    const formData = new FormData(form)
    let data = {}
    for (const [k, v] of formData.entries()) {
        data[k] = v
    }
    const keys = await generateKeys()
    data = {
        ...data,
        ...keys,
    }
    /** 
     * Validate and
     * Ajax request to register
     */
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/user/register',
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            console.log(data)
            location.href = 'login.html'
        },
        error: function (error) {
            alert('something went wrong')
            console.log(error)
        }
    })
}

async function generateKeys(bool) {
    const algorithm = {
        name: 'RSA-OAEP',
        modulusLength: 4096, // can be 2048, 3072, or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537 as Uint8Array
        hash: { name: 'SHA-256' },
    }
    const keyPair = await window.crypto.subtle.generateKey(algorithm, true, ['encrypt', 'decrypt'])
    const publicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
    ).then((exportedKey) => {
        const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exportedKey));
        const exportedAsBase64 = btoa(exportedAsString);
        const exportedAsPem = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        return exportedAsPem;
    })
    const privateKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    ).then((exportedKey) => {
        const exportedAsString = String.fromCharCode.apply(null, new Uint8Array(exportedKey));
        const exportedAsBase64 = btoa(exportedAsString);
        const exportedAsPem = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
        return exportedAsPem;
    })
    return { public_key: publicKey, private_key: privateKey };
}

async function getKeys(publicKey, privateKey) {
    const importPrivateKey = async (pem) => {
        const front = 28, back = 26, len = pem.length
        pem = pem.slice(front, len - back);
        const binaryDer = window.atob(pem);
        const binaryDerBuffer = new Uint8Array(binaryDer.length);
        for (let i = 0; i < binaryDer.length; i++) {
            binaryDerBuffer[i] = binaryDer.charCodeAt(i);
        }
        return await window.crypto.subtle.importKey(
            'pkcs8',
            binaryDerBuffer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            ['decrypt']
        );
    }
    const importPublicKey = async (pem) => {
        const front = 27, back = 25, len = pem.length
        pem = pem.slice(front, len - back);
        const binaryDer = window.atob(pem);
        const binaryDerBuffer = new Uint8Array(binaryDer.length);
        for (let i = 0; i < binaryDer.length; i++) {
            binaryDerBuffer[i] = binaryDer.charCodeAt(i);
        }
        return await window.crypto.subtle.importKey(
            'spki',
            binaryDerBuffer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            ['encrypt']
        );
    }
    const private_key = await importPrivateKey(privateKey);
    const public_key = await importPublicKey(publicKey);
    console.log(private_key)
    console.log(public_key)
}

$(document).ready(function () {
    generateKeys()
    $("#register-form").on('submit', function (e) {
        e.preventDefault()
        registerUser()
    })
})
