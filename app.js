const fs = require('fs');
const path = require('path')
const { createCanvas, Image } = require('canvas');
const p = process.argv.splice(2)[0]||path.join(__dirname,"./test")

const dirFiles = fs.readdirSync(p);
dirFiles.forEach(item=>{
    fs.renameSync(path.join(p ,item),path.join(p ,item.padStart(10,0)))
})

fs.readdir(p, async function (err, files) {
    if (err) {
        console.warn(err)
    } else {
        const filesPng = files.filter((itme) => itme.endsWith(".png"));
        let canvas = null;
        let ctx = null;
        let now = new Date();
        for (let i = 0; i < filesPng.length; i++) {
            const squid = fs.readFileSync(path.join(p ,filesPng[i]))

            await new Promise((resolve,reject)=>{
                const img = new Image()
                img.dataMode = Image.MODE_MIME | Image.MODE_IMAGE
                img.onerror = err => { throw err }
                img.onload = () => {
                    if(!canvas){
                        canvas = createCanvas(img.width, img.height, 'pdf')
                        ctx = canvas.getContext('2d',{ pixelFormat: 'RGB24' })
                    }
                    ctx.drawImage(img, 0, 0);
                    if (filesPng.length-1 !== i) {
                        ctx.addPage()
                        // console.log(ilesPng.length,i)
                    }
                    resolve()
                }
                img.src = squid
            })
        }
        const pdfName = `${__dirname}/test-${Date.now()}.pdf`;

        const out = fs.createWriteStream(pdfName)
        const stream = canvas.createPDFStream({
                title: '有划手册',
                keywords: '有划手册',
                creationDate: new Date()
              })
        stream.pipe(out)
        out.on('finish', () =>  console.log('The PNG file was created.'))
        console.log(new Date() - now);

        // fs.writeFile(pdfName, canvas.toBuffer('application/pdf',{
        //     title: '有划手册',
        //     keywords: '有划手册',
        //     creationDate: new Date()
        //   }), function (err, data) {
        //     if (err) {
        //         console.log(err);
        //     }
        //     console.log(`生成的文件在：${pdfName}`)
        // })
    }
})

// const fs = require('fs');
// const path = require("path")
// var PdfPrinter = require('pdfmake');
// var printer = new PdfPrinter();
// const p = process.argv.splice(2)[0]||__dirname

// fs.readdir(p, function (err, files) {
//     if (err) {
//         console.warn(err)
//     } else {
//         const filesPng = files.filter((itme) => itme.endsWith(".png"));
//         const imageContentList = filesPng.map(item=>({image:path.join(p,item),pageMargins:[0,0,0,0],fit: [1000, 1000]}))
//         var docDefinition = {
//             pageSize:{
//                 width:'auto',
//                 height:'auto'
//             },
//             content:imageContentList
//         }
//         var now = new Date();
//         var pdfDoc = printer.createPdfKitDocument(docDefinition);
//         pdfDoc.pipe(fs.createWriteStream('document.pdf'));
//         pdfDoc.end();
//         // var pdf = pdfmake.createPdf(docDefinition);
//         // console.log(pdf)
//         // var pdfDoc = printer.createPdfKitDocument(docDefinition);
//         // pdf.write('./images.pdf');
//         // pdfDoc.pipe(fs.createWriteStream('./images.pdf'));
//         // pdfDoc.end();
//         console.log(new Date() - now);
//     }
// })

// const fs = require('fs');
// const path = require("path")
// var pdfWriter = require('hummus').createWriter(__dirname + '/HighLevelImages.pdf');
// const p = process.argv.splice(2)[0]||path.join(__dirname,"./test")

// fs.readdir(p, function (err, files) {
//     if (err) {
//         console.warn(err)
//     } else {
//         const filesPng = files.filter((itme) => itme.endsWith(".png"));
//         page = {};
//         var now = new Date();
//         filesPng.forEach(item=>{
//             console.log(item)
//             const dim = pdfWriter.getImageDimensions(path.join(p,item))
//             page = pdfWriter.createPage(0,0,dim.width,dim.height);
//             var cxt = pdfWriter.startPageContentContext(page);
//             // simple image placement
//             cxt.drawImage(0,0,path.join(p,item));
    
//             pdfWriter.writePage(page);
//         })
// 		pdfWriter.end();
//         console.log(new Date() - now);
//     }
// })