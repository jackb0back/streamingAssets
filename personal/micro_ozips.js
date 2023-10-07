console.log(`
__$$$___ $$$$$$$_ _$$__ _______ _$$$$$__ _________ _______ _$$__
_$$_$$__ ____$$__ _$$__ _$$$$__ $$___$$_ __$$$$$__ _$$$$__ _$$__
$$___$$_ ___$$___ _____ $$__$$_ _$$$____ ______$$_ $$__$$_ _____
$$___$$_ __$$____ _$$__ $$__$$_ ___$$$__ ___$$$$$_ $$__$$_ _$$__
_$$_$$__ _$$_____ _$$__ $$$$$__ $$___$$_ __$$__$$_ $$$$$__ _$$__
__$$$___ $$$$$$$_ $$$$_ $$_____ _$$$$$__ ___$$$$$_ $$_____ $$$$_
`,"\n","made by Jackboback");

/*

USEAGE:

1.) to start you want to create a new construct 
A.) var test1 = new OZipS("ozip name","path_to_OZip","mounting point")
AA.) mounting point is a document like with an iframe ==> document.getElementById("frame").contentWindow.document;
2.) run the OZipS with OZipS.execute( <ozip construct> );
B.) <ozip construct> is the construct created above which in this example whould be test1


Thats really it to run a OZipS. If you want to inject code into the OZipS you do OZipS.executeCodeInChild(< code >,< ozip construct >)



*/




var OZipS = {
  currentZip: null,
  zips: {},
  genUUID: function() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  },
  ozips: function(name,zip,mount) {
      this.uniqeID = OZipS.genUUID();
      this.win;
      this.zip = zip;
      this.windoc = mount;
      this.filenames = [];
      this.blobs = [];
      this.fileblobs = {};
      this.channel = new BroadcastChannel(OZipS.uniqeID+'codeExecutionChannel');
      this.Cchannel = new BroadcastChannel(OZipS.uniqeID+'child_codeExecutionChannel');

      this.channel.onmessage = (event) => {
        // Execute the received code in the parent window
        try {
          const base64Code = event.data;
          const decodedCode = atob(base64Code);
          eval(decodedCode);
        } catch (error) {
          console.error('Error executing code:', error);
        }
      };
  },
  executeCodeInChild: function (code,oz) {
    const base64Code = btoa(code);
    oz.Cchannel.postMessage(base64Code);
  },
  extractScriptContents: function(htmlData) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlData, 'text/html');
  
    const scriptTags = doc.querySelectorAll('script');
    const extractedData = [];
  
    scriptTags.forEach((scriptTag) => {
      const extractedObj = {};
  
      // Extract attributes
      for (const attr of scriptTag.attributes) {
        extractedObj[attr.name] = attr.value;
      }
  
      // Extract content
      if (scriptTag.textContent) {
        extractedObj.innerHTML = scriptTag.textContent;
      }
  
      extractedData.push(extractedObj);
      
      // Remove the script tag
      scriptTag.parentNode.removeChild(scriptTag);
    });
  
    const cleanedHTML = doc.documentElement.outerHTML;
    console.log({
      extractedData: extractedData,
      cleanedHTML: cleanedHTML,
    });
    return {
      extractedData: extractedData,
      cleanedHTML: cleanedHTML,
    };
  
  },
  getMimeType: function(fileName) {
    const mimeTypeLookup = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.wasm': 'application/wasm',
      '.zip': 'application/zip',
      '.html': 'text/html'
      // Add more mappings as needed
    };
  
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const mimeType = mimeTypeLookup[fileExtension];
  
    return mimeType || 'application/octet-stream'; // Default MIME type if extension not found
  },
  isURL: function(inputString) {
    return inputString.startsWith("https://") || inputString.startsWith("http://");
  },
  loadScript: async function(src,ozip) {
    return new Promise((resolve, reject) => {
      const script = ozip.windoc.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      ozip.windoc.body.appendChild(script);
    });
  },
  extractCssPaths: function(htmlString) {
    const cssPaths = [];
    let cleanedHtml = htmlString;
  
    // Create a temporary DOM element to parse the HTML string
    const tempElement = document.createElement('div');
    tempElement.innerHTML = cleanedHtml;
  
    // Extract CSS paths from <link> tags and remove them from the HTML
    const linkElements = tempElement.querySelectorAll('link[rel="stylesheet"]');
    linkElements.forEach((linkElement) => {
      const href = linkElement.getAttribute('href');
      if (href) {
        cssPaths.push(href);
        linkElement.parentNode.removeChild(linkElement); // Remove the <link> element from the DOM
      }
    });
  
    // Serialize the cleaned HTML back to a string
    cleanedHtml = tempElement.innerHTML;
  
    return { cleanedHtml, cssPaths };
  },
  compzLinks: function(ozip) {
    var docElm = ozip.windoc;
    var blobs = ozip.blobs;
    for (let i =0; i < docElm.getElementsByTagName("button").length; i++) {
      console.log(i)
     console.log(docElm.getElementsByTagName("button")[i].dataset.zlink !== undefined);
      if (docElm.getElementsByTagName("button")[i].dataset.zlink !== undefined) {
        console.log(blobs);
        console.log(blobs[docElm.getElementsByTagName("button")[i].dataset.zlink]);
       
        docElm.getElementsByTagName("button")[i].onclick = function() {
          console.log(ozip.zip);
            execute(ozip.zip,docElm,docElm.getElementsByTagName("button")[i].dataset.zlink);
              }
      }
  
  if(docElm.getElementsByTagName("button")[i].dataset.home !== undefined) {
  console.log("EEEe")
  setTimeout(function(){
    executeCodeInChild(`
    document.getElementsByTagName("button")[`+i+`].onclick = function() {
     //Home function
      executeCodeInParent("runcli();")
    }
    `)
  },200)
  
  }
   
  
    }
  },
  delay: function(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  },
  execute: function(ozip,indexFile) {

    var zip = ozip.zip;
    var docElm = ozip.windoc;
    OZipS.currentZip = zip;
    OZipS.zips[OZipS.currentZip] = zip;
    const filenames = [];
    var loader = new ZipLoader(zip);
    async function loadScripts(scripts) {
      for (const data of scripts) {
        const script = docElm.createElement('script');
        Object.assign(script, data);
  
        if (data.src) {
          if (!OZipS.isURL(data.src)) {
            const content = loader.extractAsText(data.src);
            script.innerHTML = content;
            script.removeAttribute('src');
          } else {
            const src = data.src;
            await OZipS.loadScript(src,ozip); // Wait for script to load
          }
        } else {
          // Handle cases where src is not defined
        }
  
        docElm.body.appendChild(script);
        await OZipS.delay(100);
      }
    }
  
    async function loadAssets() {
  
        
        await loader.load(); // Start loading the zip
        ozip.fileblobs = {};
  
        for (const filename of Object.keys(loader.files)) {
          const data = loader.extractAsText(filename);
          ozip.fileblobs[filename] = loader.extractAsBlobUrl(filename, OZipS.getMimeType(filename));
          filenames.push(filename);
        }
        var oneF = Object.keys(ozip.fileblobs).length == 1;
        console.log("one file?: " + oneF);
  
        if (oneF && window.location.protocol !== 'file:') {
          docElm.location.href = ozip.fileblobs[Object.keys(ozip.fileblobs)[0]];
          return;
        }
  
  
        if (indexFile !== undefined) {
          console.log(indexFile == undefined);
        var styleSheets = OZipS.extractCssPaths(loader.extractAsText(indexFile));
        }else {
          var styleSheets = OZipS.extractCssPaths(loader.extractAsText('index.html'));
  
        }
        const index = OZipS.extractScriptContents(styleSheets.cleanedHtml);
  
        docElm.body.innerHTML = '';
        docElm.head.innerHTML = '';
        docElm.write(index.cleanedHTML);
  
        await loadScripts(index.extractedData);
  
        for (const cssPath of styleSheets.cssPaths) {
          const link = docElm.createElement('link');
          link.rel = 'stylesheet';
          link.href = loader.extractAsBlobUrl(cssPath, 'text/css');
          docElm.head.appendChild(link);
        }
  
        console.log(ozip.fileblobs);
        
  
  
        var ee = ozip.windoc.createElement("script");
        ee.innerHTML = `
        const channel = new BroadcastChannel('`+ozip.uniqeID+`codeExecutionChannel');
        const Cchannel = new BroadcastChannel('`+ozip.uniqeID+`child_codeExecutionChannel');
        Cchannel.onmessage = (event) => {
          // Execute the received code in the parent window
          try {
            const base64Code = event.data;
            const decodedCode = atob(base64Code);
            eval(decodedCode);
          } catch (error) {
            console.error('Error executing code:', error);
          }
        };
        function executeCodeInParent(code) {
          const base64Code = btoa(code);
          channel.postMessage(base64Code);
        }
        `
        setTimeout(function(){
          ozip.windoc.body.appendChild(ee);
        },1000)
        
        
            var notifJS = ozip.windoc.createElement('script');
            notifJS.src = 'https://cdn.jsdelivr.net/gh/jackb0back/streamingAssets@main/personal/notifcations.js';
            ozip.windoc.body.appendChild(notifJS);
        
            var notifCSS = ozip.windoc.createElement('style');
            notifCSS.innerHTML = `
          @-webkit-keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@-webkit-keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@-webkit-keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@-webkit-keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@-webkit-keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:"";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:"";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;-webkit-animation:notyf-fadeinup .3s ease-in forwards;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px 0 rgba(0,0,0,.25);position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box;flex-shrink:0}.notyf__toast--disappear{transform:translateY(0);-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{-webkit-animation:notyf-fadeoutright .3s forwards;animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translateX(0)}.notyf__toast--disappear .notyf__message{-webkit-animation-delay:.05s;animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translateX(13%);z-index:5;-webkit-animation:ripple .4s ease-out forwards;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.3s;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;-webkit-animation:notyf-fadeinleft .3s forwards;animation:notyf-fadeinleft .3s forwards;-webkit-animation-delay:.35s;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:rgba(0,0,0,.25);border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:"";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:rgba(0,0,0,.15)}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;-webkit-animation-duration:.5s;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px 0 rgba(0,0,0,.13);width:100%}.notyf__dismiss{width:56px}}
        .n-msg {
          margin-left:10px;
          color: var(--text-color);
          font-family: sans-serif;
        }
        :root {
          --css-button: #333;
          --text-color: white;
        }
        .n-icon {
         width: 35px;
         border-radius: 10px;
         margin-top: 10px;
         left: 0;
        }
            `;
            ozip.windoc.body.appendChild(notifCSS);
        
   setTimeout(function(){
    OZipS.compzLinks(ozip);
   },200)
  
    }
  
  
    setTimeout(loadAssets, 200);
  }
}











/*

function executeInWin(src) {
  var left = (screen.width - 1200) / 2;
  var top = (screen.height - 600) / 4;
  var win = window.open("","aaadajsnd","width=1200,height=600,"+"top=" + top + ", left=" + left);
  execute(src,win.document);
  console.log("FSDRGFWSDRG")
  return;
}

*/



// Parent window code


