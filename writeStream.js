const fs = require("fs");
const path = require("path");
const v8 = require("v8");
console.log(v8.getHeapStatistics());
// node --max-old-space-size=1024(mb)*n

let writeStream = fs.createWriteStream(path.join(__dirname,"test.json"),{flags:"w"});
let start = false;
let end = false;
let end_index = 10000000000; //約200G
let counter = 0;
let chunk = 128;

function conCat(){
    let writeStream = new fs.createWriteStream(path.join(__dirname,"test.json"),{flags:"a"});
    writeStream.on("open",()=>{
        for(let i=0;(i<chunk)&&counter<end_index;i++,counter++){
            writeStream.write(`    "${Math.random()}",\n`);
        }
        if(counter == end_index){
            end = true;
            writeStream.end("    \"Workflow End\"\n]");
        } else {
            writeStream.end();
        }
    });
    
    writeStream.on("close",()=>{
        if(end==true){
            process.exit(0);
        }
        return conCat();
    })
    
}

writeStream.on("open",()=>{
    if(start == false){
        start = true;
        writeStream.write("[\n")
    }
    for(let i=0;(i<chunk)&&counter<end_index;i++,counter++){
        writeStream.write(`    "${Math.random()}",\n`);
    }
    if(counter!=end_index){
        writeStream.end();
    } else if (counter==end_index){
        writeStream.end();
        end = true;
    }
})

writeStream.on("close",()=>{
    conCat();
});