const { KeyPair, get_languages } = wasm_bindgen;
window.fn = {};
let generator_keys;

// load wasm wallet and generate wallet seed right away
async function init() {
    await wasm_bindgen();
    generator_keys = await generateClientKeys();
};

init();

const generate_xelis_wallet = function () {
  
    const mainnet = "mainnet";
    const language_idx = 0;
  
    const key_pair = new KeyPair(mainnet);
    const addr = key_pair.address();
    const private_key = key_pair.secret();
    const seed = key_pair.seed(language_idx);


    return seed
};

const establish_node = async () => {
    window.fn.showDialog('loading-dialog');

    let requestBody = JSON.stringify({
        'token': window.constants.SESSION_TOKEN.serialize(),
        'client_pub': window.constants.CLIENT_PUBLIC_KEY,
        'launch_token': await generateLaunchToken(document.querySelector('#launch-key').value),
        'seed_cipher': await generateSharedEncryptedText(document.querySelector('#xelis-seed-text').value, window.constants.SERVER_PUBLIC_KEY, window.constants.CLIENT_SESSION_KEYS.privateKey),
      });

    fetch('/establish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
      .then(response => {
        console.log(response)
        if (response.status === 200) {
            return response.json();
        } else {
            window.fn.hideDialog('loading-dialog');
            window.fn.showDialog('fail-dialog');
            throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        window.fn.hideDialog('loading-dialog');
        console.log("establish : ",data);
          
      });

      
};

document.addEventListener('init', function(event) {
    let page = event.target;
    let inputs = ['logo-file', 'key-store-file'];

    if (page.id === 'new_node') {

        document.querySelector('#generate-xelis-seed').onclick = function () {
            let seed = generate_xelis_wallet();
            document.querySelector('#xelis-seed-text').value = seed.splice(0, (seed.length+1)).join(" ");
        };
        document.querySelector('#establish-button').onclick = function () {
            //console.log(document.querySelector('#launch-key').value)
            window.fn.validateAllInputsAndCall(
                'Establish new Node?',
                 'All fields are required.',
                  establish_node
                );
        };
    } else if (page.id === 'establish') {
        inputs.forEach(function(inp) {
            document.querySelector('#btn-'+inp).onclick = function () {
                document.querySelector('#'+inp).click();
            };
        });
        
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        window.fn.renderNodeCardHeader(window.constants.LOGO, 'AXIEL', 'XRO Network');
    }
});

window.fn.pushPage = function(page) {
    document.querySelector('#Nav').pushPage(page+'.html', {data: {title: '|| ESTABLISH ||', logo: window.constants.LOGO}});
};