const $ = id => document.getElementById(id);
const display = $("display"), hint = $("hint");
let entry = "", unlockedKey = null, urls = [];
const DB_NAME = "nikhil-private-vault", STORE = "files", META = "meta";
let db;

function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>{const d=req.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:"id"});if(!d.objectStoreNames.contains(META))d.createObjectStore(META)};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function tx(store,mode="readonly"){return db.transaction(store,mode).objectStore(store)}
function get(store,key){return new Promise((res,rej)=>{const r=tx(store).get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function put(store,value,key){return new Promise((res,rej)=>{const r=key===undefined?tx(store,"readwrite").put(value):tx(store,"readwrite").put(value,key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
function allFiles(){return new Promise((res,rej)=>{const r=tx(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
function removeFile(id){return new Promise((res,rej)=>{const r=tx(STORE,"readwrite").delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
const enc = new TextEncoder(), dec = new TextDecoder();
function bytes(n){return crypto.getRandomValues(new Uint8Array(n))}
async function derive(pin,salt){const material=await crypto.subtle.importKey("raw",enc.encode(pin),"PBKDF2",false,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:250000,hash:"SHA-256"},material,{name:"AES-GCM",length:256},false,["encrypt","decrypt"])}
async function encrypt(data,key){const iv=bytes(12),cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,data);return {iv:[...iv],data:cipher}}
async function decrypt(record,key){return crypto.subtle.decrypt({name:"AES-GCM",iv:new Uint8Array(record.iv)},key,record.data)}
async function setupOrUnlock(pin){
 const config=await get(META,"config");
 if(!config){const salt=bytes(16),key=await derive(pin,salt),proof=await encrypt(enc.encode("NIKHIL_VAULT_OK"),key);await put(META,{salt:[...salt],proof},"config");return key}
 const key=await derive(pin,new Uint8Array(config.salt));
 try{const proof=await decrypt(config.proof,key);if(dec.decode(proof)!=="NIKHIL_VAULT_OK")throw 0;return key}catch{return null}
}
function showToast(s){const t=$("toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function setDisplay(){display.textContent=entry||"0"}
function lock(){unlockedKey=null;urls.forEach(URL.revokeObjectURL);urls=[];$("vault").classList.add("hidden");$("calculator").classList.remove("hidden");entry="";setDisplay();hint.textContent="Enter PIN, then tap ="}
async function unlock(){if(entry.length<4){showToast("PIN must be at least 4 digits");return}try{const key=await setupOrUnlock(entry);if(!key){showToast("Incorrect PIN");entry="";setDisplay();return}unlockedKey=key;$("calculator").classList.add("hidden");$("vault").classList.remove("hidden");entry="";await renderGallery()}catch(e){showToast("Could not open vault. Use HTTPS or localhost.")}}
async function renderGallery(){urls.forEach(URL.revokeObjectURL);urls=[];const files=await allFiles(),gallery=$("gallery");gallery.innerHTML="";$("empty").classList.toggle("hidden",files.length>0);for(const f of files){try{const plain=await decrypt(f.payload,unlockedKey),blob=new Blob([plain],{type:f.type}),url=URL.createObjectURL(blob);urls.push(url);const tile=document.createElement("div");tile.className="tile";let media;if(f.type.startsWith("video/")){media=document.createElement("video");media.controls=true;media.playsInline=true}else{media=document.createElement("img");media.alt="Private photo"}media.src=url;const del=document.createElement("button");del.textContent="×";del.title="Delete file";del.onclick=async()=>{if(confirm("Delete this private file?")){await removeFile(f.id);await renderGallery()}};tile.append(media,del);gallery.append(tile)}catch{showToast("A saved file could not be decrypted")}}}
$("filePicker").addEventListener("change",async e=>{if(!unlockedKey)return;const files=[...e.target.files];for(const file of files){if(!file.type.startsWith("image/")&&!file.type.startsWith("video/"))continue;try{const payload=await encrypt(await file.arrayBuffer(),unlockedKey);await put(STORE,{id:crypto.randomUUID(),name:file.name,type:file.type,size:file.size,payload})}catch{showToast("Could not save "+file.name)}}e.target.value="";await renderGallery();showToast("Files encrypted and saved")});
$("lockBtn").onclick=lock;
document.querySelector(".keys").addEventListener("click",async e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.digit!==undefined){if(entry.length<12)entry+=b.dataset.digit;setDisplay();return}const a=b.dataset.action;if(a==="clear"){entry="";setDisplay()}else if(a==="back"){entry=entry.slice(0,-1);setDisplay()}else if(a==="equals"){await unlock()}else if(a==="decimal"||a==="percent"||["add","subtract","multiply","divide"].includes(a)){hint.textContent="PIN mode";showToast("Use digits and = to open the private gallery") }});
(async()=>{try{db=await openDB();const cfg=await get(META,"config");hint.textContent=cfg?"Enter PIN, then tap =":"Set a new PIN (4–12 digits), then tap ="}catch{hint.textContent="Storage unavailable in this browser"}})();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
