const fs = require('fs');
const translate = require('google-translate-api');

function translateTexts(from, to, texts) {
    //if (from === to) return { to, translates: texts };
    return Promise.all(
        texts.map((text, i) => {
            if ((text||'').trim().length < 2) return text;

            // Get list of untranslatables text "[NAME]"
            var untranslatables = [];
            var reg = /\[([^\]]+)\]/g;
            text = text.replace(reg, (all, inner) => {
                untranslatables.push(inner);
                return `[${untranslatables.length-1}]`;
            });

            var resolveTranslate = () => {
                return (from === to ? Promise.resolve({ text }) : translate(text, {from, to}))
                .then(res => {
                    // Replace untranslatables key by correct text
                    text = res.text.replace(reg, (all, inner) => {
                        var i = parseInt(inner);
                        if (Number.isNaN(i)) return all;
                        var n = untranslatables[i];
                        return n === undefined ? all : n;
                    });
                    return text;
                })
                .catch(err => {
                    console.error('translate', to, i, text, err);
                    return resolveTranslate();
                })
            };

            return resolveTranslate();
            
        })
    ).then(translates => {
        console.log('translateTexts', from, to, translates);
        return { to, translates };
    });
}

function createTranslate(from, tos, texts) {

    // texts = texts.filter(t => (t||'').indexOf('[') !== -1);
    // tos = ['en'];

    Promise.all(tos.map(to => translateTexts(from, to, texts))).then(results => {
        console.log(results);

        var translatesByLang = {
            keys: texts
        };
        for (var r of results) {
            translatesByLang[r.to] = r.translates;
        }
        
        var filename = `${__dirname}/translates.ts`;
        console.log('filename', filename);

        var json = JSON.stringify(translatesByLang, null, 4);
        console.log('json', json);

        fs.writeFile(filename, `export default ${json};`, err => {
            if (err) return console.log(err);
            console.log("The file was saved!");
        }); 
    })

    // for (const to of tos) {
    //     if (from !== to) continue;
    //     var translates = translatesByLang[to] = [];
    //     for (var i=0, len=3; i<len; i++) {
    //         var text = translates[i] = texts[i];
    //         console.log('text', i, from, to, text);
    //         promises.push(
    //             translate(text, {from, to}).then(res => {
    //                 console.log('text', i, from, to, text, res.text);
    //                 translates[i] = res.text;
    //             }).catch(err => {
    //                 console.error(err);
    //             })
    //         );
    //     }
    // }

    // Promise.all(promises).then(() => {
    //     console.log('translatesByLang', translatesByLang);
    // });

}



createTranslate('fr', ['fr', 'en', 'es', 'de', 'zh-CN'],
    ["Tartes flambées","La traditionnelle","Crème, lardons, oignons","La gratinée","Crème, lardons, oignons, [émmental]","La champignon","Crème, lardons, oignons, Champignon","La Forestière","Crème, lardons, oignons, champignon, [émmental]","La [Munster]","Crème, lardons, oignons, [munster]","La [Ribeaupierre]","Crème, lardons, oignons, [ribeaupierre]","La Basque","Crème, lardons, oignons, brebis","La chèvre","Crème, lardons, oignons, chèvre","La formule","une tarte classique + 1 verre de vin","Nos salades","Tomates Mozza","cœur de crème burrata 200 grammes","La vigneronne","cervelas alsacien, pomme de terre, tomates, salade, cornichon, sauce maison, raisins secs, herbes","Salade de la mer","salade, tomate, œuf, thon, truites fumées ou saumon herbes (selon arrivage)","Salade végétarienne","Salade, tomate, maïs, asperges, steack végétarien","Tartare de bœuf","viande hachée, échalote, jaune d’œuf, câpres, sauces","Les classiques Alsaciens","Choucroute garnie","(5 éléments) saucisse fumée, [Knack], salé de porc, lards, pomme de terre, choux Crème, lardons, oignons","Jarret de porc","entre 600 et 750 grammes braisé avec accompagnement","Jarret de porc au [munster]","entre 600 et 750 grammes braisé au [munster]","Beakeoffe","viande de bœuf, porc et agneau marinées au vin blanc, pomme de terre, carottes.","Pâté en croute Alsacien","avec légumes","Fromage de tête ","Quiche Lorraine","Tarte à l’oignon","Assiettes de foie gras","2 tranches de foie gras, confiture, pains, 1 verre de vendange tardive","Planchette mixte","[gendarme], jambon fumé, [chorizo], jambon du sud ouest, fuet, [munster], [ribeaupierre], brebis, cornichon, beurre, confiture cerise","Assiette de fromage","[Munster], [ribeaupierre], brebis, confiture, cumin","Menu enfant","frites [Knacks]","bol de salade","assiette de frites","NOTRE TOMATES MOZZA","LA PLANCHETTE MIXTE","NOS TARTES FLAMBÉES","LA CHÈVRE","QUICHE LORRAINE","LA TARTE À L’OIGNON","LE TARTARE DE BŒUF"]
);