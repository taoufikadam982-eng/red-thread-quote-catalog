import {productSchema,blankProduct,type AdminProduct} from './product-schema';
const aliases:Record<string,string>={titre:'name',produit:'name',nom:'name',title:'name',reference:'reference',ref:'reference',categorie:'category',category:'category',specs:'specs',description:'specs',prix:'price',prixdh:'price',price:'price',prixbarre:'old_price',oldprice:'old_price',disponibilite:'availability',availability:'availability',masque:'hidden',hidden:'hidden',indicatif:'indicative',indicative:'indicative',marque:'brand',brand:'brand'};
export function mapImportRows(rows:Record<string,unknown>[]):AdminProduct[]{return rows.filter(r=>Object.values(r).some(Boolean)).map((row,index)=>{
 const mapped:Record<string,unknown>={};for(const [key,value]of Object.entries(row)){const normalized=key.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');const target=aliases[normalized];if(target)mapped[target]=value;}
 const num=(value:unknown)=>Number(String(value).replace(/\s|DH|MAD/gi,'').replace(',','.'));
 const bool=(value:unknown)=>/^(true|oui|1)$/i.test(String(value));
 const draft={...blankProduct(),...mapped,price:num(mapped['price']??0),old_price:mapped['old_price']?num(mapped['old_price']):null,hidden:bool(mapped['hidden']),indicative:mapped['indicative']===undefined?true:bool(mapped['indicative'])};
 const result=productSchema.safeParse(draft);if(!result.success)throw new Error(`Ligne ${index+2} : ${result.error.issues[0]?.message}`);return result.data;
});}
export async function parseProductFile(file:File):Promise<AdminProduct[]>{
 if(file.size>20*1024*1024)throw new Error('Fichier trop volumineux (20 Mo maximum).');
 const ext=file.name.split('.').pop()?.toLowerCase();
 if(ext==='csv'){const {default:Papa}=await import('papaparse');const result=Papa.parse<Record<string,unknown>>(await file.text(),{header:true,skipEmptyLines:true});if(result.errors.length)throw new Error(result.errors[0]?.message ?? 'CSV invalide');return mapImportRows(result.data);}
 if(ext==='xlsx'||ext==='xls'){const XLSX=await import('xlsx');const book=XLSX.read(await file.arrayBuffer(),{type:'array'});const sheetName=book.SheetNames[0];const first=sheetName?book.Sheets[sheetName]:undefined;if(!first)throw new Error('Classeur vide.');return mapImportRows(XLSX.utils.sheet_to_json(first));}
 let text='';
 if(ext==='docx'){
   const mammoth=await import('mammoth/mammoth.browser');
   const html=(await mammoth.convertToHtml({arrayBuffer:await file.arrayBuffer()})).value;
   // Parse inert markup for text only; uploaded HTML is never rendered.
   const doc=new DOMParser().parseFromString(html,'text/html');
   const tableRows=Array.from(doc.querySelectorAll('table tr')).map(tr=>Array.from(tr.querySelectorAll('th,td')).map(td=>td.textContent?.trim()??''));
   if(tableRows.length>1){const header=tableRows.shift();if(header)return mapImportRows(tableRows.map(values=>Object.fromEntries(header.map((h,i)=>[h,values[i]??'']))));}
   text=doc.body.textContent??'';
 }
 else if(ext==='pdf'){
   const pdfjs=await import('pdfjs-dist');const worker=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');pdfjs.GlobalWorkerOptions.workerSrc=worker.default;
   const task=pdfjs.getDocument({data:new Uint8Array(await file.arrayBuffer())});const pdf=await task.promise;
   try{for(let i=1;i<=Math.min(pdf.numPages,50);i++){
     const page=await pdf.getPage(i);const content=await page.getTextContent();const lines=new Map<number,{x:number;value:string}[]>();
     for(const item of content.items){if(!('str' in item)||!item.str.trim())continue;const y=Math.round(item.transform[5]);const line=lines.get(y)??[];line.push({x:item.transform[4],value:item.str});lines.set(y,line);}
     text+=Array.from(lines).sort((a,b)=>b[0]-a[0]).map(([,line])=>line.sort((a,b)=>a.x-b.x).map(item=>item.value).join('\t')).join('\n')+'\n';
   }}finally{await task.destroy();}
 }
 else if(file.type.startsWith('image/')){const {createWorker}=await import('tesseract.js');const worker=await createWorker('fra+eng');text=(await worker.recognize(file)).data.text;await worker.terminate();}
 else throw new Error('Formats acceptés : CSV, Excel, Word (.docx), PDF et photos.');
 const lines=text.split('\n').filter(l=>l.trim());const records=lines.map(line=>line.split(/\t|;|\||\s{2,}/).map(v=>v.trim()).filter(Boolean));
 const header=records.shift();if(!header)throw new Error('Aucun texte détecté.');
 const rows=records.map(values=>Object.fromEntries(header.map((h,i)=>[h,values[i]??''])));
 if(!rows.length)throw new Error('Aucun tableau détecté. Utilisez un CSV ou Excel avec Titre, Référence, Catégorie et Prix.');
 return mapImportRows(rows);
}
