const { KeyPair, get_languages } = wasm_bindgen;
window.fn = {};

// load wasm wallet and generate wallet seed right away
async function load_xelis_wallet() {
    await wasm_bindgen();
};

load_xelis_wallet();

const generate_xelis_wallet = function () {
  
    const mainnet = "mainnet";
    const language_idx = 0;
  
    const key_pair = new KeyPair(mainnet);
    const addr = key_pair.address();
    const private_key = key_pair.secret();
    const seed = key_pair.seed(language_idx);


    return seed
};

const establish_node = async (token, client_pub) => {
    window.fn.showDialog('loading-dialog')
    let requestBody = JSON.stringify({
        'token': token,
        'client_pub': client_pub
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
            window.fn.hideDialog('loading-dialog')
            window.fn.showDialog('fail-dialog');
            throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {

        console.log("establish : ",data);
        console.log('-------------------------------------------------');
          
      });
      //window.fn.hideDialog('loading-dialog')
};

document.addEventListener('init', function(event) {
    var page = event.target;

    if (page.id === 'new_node') {
        document.querySelector('#generate-xelis-seed').onclick = function () {
            let seed = generate_xelis_wallet();
            document.querySelector('#xelis-seed-text').value = seed.splice(0, (seed.length+1)).join(" ");
        };
        document.querySelector('#establish-button').onclick = function () {

            establish_node( window.constants.SESSION_TOKEN.serialize(), window.constants.CLIENT_PUBLIC_KEY );
        };
    } else if (page.id === 'establish') {
        document.querySelector('#btn-logo-file').onclick = function () {
            document.querySelector('#logo-file').click();
        };
        page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
        window.fn.renderNodeCardHeader(window.constants.LOGO, 'AXIEL', 'XRO Network');
    }
});

window.fn.pushPage = function(page) {

    document.querySelector('#Nav').pushPage(page+'.html', {data: {title: '|| ESTABLISH ||', logo: window.constants.LOGO}});
};