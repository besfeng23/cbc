import { cp, mkdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'dist');
const files=['index.html','site.js','analytics.js','analytics-consent.css','styles.css','coastline.svg','robots.txt','site.webmanifest','apple-touch-icon.png','favicon-16.png','favicon-32.png','favicon-64.png','favicon.ico','favicon.svg','icon-192.png'];
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
for(const file of files){
 const source=path.join(root,file);
 try{await stat(source);await cp(source,path.join(out,file),{recursive:true});}
 catch(error){if(error.code!=='ENOENT')throw error;}
}
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
console.log('Static Changi build created in dist. Vercel API functions remain at the project root.');
