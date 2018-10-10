

window.onload = function(){
    let canvas = document.getElementById('MainCanvas');
    let selectCardClass = document.getElementById('CardClass');
    let selectCardRarity = document.getElementById('CardRarity');
    let inpCardTitle = document.getElementById('CardTitle');
    let inpCardType = document.getElementById('CardType');
    let inpCardMagicka = document.getElementById('CardMagicka');
    let inpCardPower = document.getElementById('CardPower');
    let inpCardHealth = document.getElementById('CardHealth');
    let inpCardArt = document.getElementById('CardArt');
    let inpSupportShout = document.getElementById('SupportShout');
    let txtCardText = document.getElementById('CardText');
    let btnSaveImage = document.querySelector('.btn-save_image');

    let images = [];
    let currentCard = {
        art: '',
        artX: 0,
        artY: 0,
        supportShout: '',
        frame: 'mono_neutral',
        health: '4',
        magicka: '5',
        power: '3',
        rarity: 'epic',
        type: 'Player',
        text: '[Summon]: Keep hope until \nall issues with the \nnew client are resolved.',
        title: 'Forgotten Hero'
    };
    let WebFontConfig = {
        active: function() {
            preloadImages();
        },
        google: {
            families: ['Merriweather:300,400,700', 'Rubik:400,700,900', 'Ubuntu:300,400,700,900']
        }
    };
    WebFont.load(WebFontConfig);

    selectCardClass.onchange = function(){
        currentCard.frame = this.value;
        drawCardImage();
    };

    selectCardRarity.onchange = function(){
        currentCard.rarity = this.value;
        drawCardImage();
    };

    inpCardTitle.onkeyup = function(){
        currentCard.title = this.value;
        drawCardImage();
    };

    inpCardMagicka.onkeyup = function(){
        currentCard.magicka = this.value;
        drawCardImage();
    };

    inpCardPower.onkeyup = function(){
        currentCard.power = this.value;
        drawCardImage();
    };

    inpCardHealth.onkeyup = function(){
        currentCard.health = this.value;
        drawCardImage();
    };

    inpSupportShout.onkeyup = function(){
        currentCard.supportShout = this.value;
        drawCardImage();
    };

    txtCardText.onkeyup = function(){
        currentCard.text = this.value;
        drawCardImage();
    };

    inpCardType.onkeyup = function(){
        currentCard.type = this.value;
        drawCardImage();
    };

    inpCardArt.onchange = function(){
        if(inpCardArt.files.length !== 1 ) return;
        let file = inpCardArt.files[0];
        let img = new Image();
        if(file.type.match('image.*')) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function(evt){
                if( evt.target.readyState === FileReader.DONE) {
                    img.src =  evt.target.result;
                    img.onload = function () {

                        currentCard.art = cropImage(img, 320, 420);
                    };
                }
            }
        }
    };

    btnSaveImage.onclick = function(e){
        e.stopPropagation();
        e.preventDefault();

        canvas.toBlob(function(blob) {
            let a = document.createElement('A');
            a.target = '_blank';
            a.download = "image.png";
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }, "image/png");
    };

    function drawCardImage() {
        let ctx = canvas.getContext("2d");

        let layerArt = getImageForLayer('art');
        let layerFrame = getImageForLayer('frame');
        let layerRarity = getImageForLayer('rarity');
        let layerSupport = getImageForLayer('support');
        let layerPH = getImageForLayer('ph');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(layerArt) ctx.drawImage(layerArt, 60, 120, 320, 420);
        if(layerFrame) ctx.drawImage(layerFrame, 0, 0);
        if(layerRarity) ctx.drawImage(layerRarity, 0, 0);
        if(layerSupport) ctx.drawImage(layerSupport, 0, 0);
        if(layerPH) ctx.drawImage(layerPH, 0, 0);

        //Magicka
        ctx.textAlign="center";
        ctx.font = 'bold 54px Ubuntu';
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.strokeText(currentCard.magicka, 65, 110);
        ctx.fillText(currentCard.magicka, 65, 110);

        //Power & Health
        ctx.textAlign="center";
        ctx.font = 'bold 52px Ubuntu';
        ctx.fillStyle = '#FDF6DF';
        ctx.fillText(currentCard.power, 65, 415);
        ctx.fillText(currentCard.health, 375, 415);

        //Type
        ctx.textAlign="center";
        ctx.font = '300 14px Merriweather';
        ctx.fillStyle = '#E0DDb9';
        ctx.fillText(currentCard.type, 220, 130);

        //Title
        let titleFontSize = currentCard.title.length >= 28 ? 14
            : currentCard.title.length >= 20 ? 18 : 24;
        ctx.textAlign="center";
        ctx.font = 'bold '+titleFontSize+'px Merriweather';
        ctx.fillStyle = '#FDF6DF';
        ctx.fillText(currentCard.title, 230, 105);

        //Support
        ctx.textAlign = "center";
        ctx.font = '700 16px Merriweather';
        ctx.fillStyle = '#111';
        ctx.fillText(currentCard.supportShout, 220, 488);

        //Text
        drawCardText(ctx);
    }

    function getImageForLayer(layer){
        let src = '';
        switch(layer){
            case 'art':
                if(currentCard.art) return currentCard.art;
                src = 'art_default.png';
                break;
            case 'frame':
                src = 'frame_' + currentCard.frame + '.png' ;
                break;
            case 'rarity':
                src = 'rarity_' + currentCard.rarity + '.png';
                break;
            case 'support':
                src = currentCard.supportShout ? 'support_bg.png' : '';
                break;
            case 'ph':
                src = 'power_health_bg.png';
                break;
        }

        if(src === '') return null;
        return images['images/' + src];
    }

    function preloadImages() {
        let arrImageNames = [
            'art_default.png',
            'frame_duo_mage.png',
            'frame_duo_warrior.png',
            'frame_mono_strength.png',
            'frame_trio_red_blue_purple.png',
            'frame_trio_tribunal.png',
            'rarity_legendary_unique.png',
            'frame_duo_archer.png',
            'frame_duo_monk.png',
            'frame_mono_agility.png',
            'frame_mono_willpower.png',
            'frame_trio_red_blue_yellow.png',
            'frame_trio_yellow_green_purple.png',
            'rarity_rare.png',
            'frame_duo_assassin.png',
            'frame_duo_scout.png',
            'frame_mono_endurance.png',
            'frame_trio_blue_yellow_green.png',
            'frame_trio_red_green_purple.png',
            'rarity_common.png',
            'support_bg.png',
            'frame_duo_battlemage.png',
            'frame_duo_sorcerer.png',
            'frame_mono_intelligence.png',
            'frame_trio_dagoth.png',
            'frame_trio_redoran.png',
            'rarity_epic.png',
            'frame_duo_crusader.png',
            'frame_duo_spellsword.png',
            'frame_mono_neutral.png',
            'frame_trio_hlaalu.png',
            'frame_trio_telvanni.png',
            'rarity_legendary.png',
            'power_health_bg.png'
        ];
        let loadedImagesCount = 0;

        for(let i in arrImageNames){
            let img = new Image();
            img.onload = () => {
                loadedImagesCount++;
                if (loadedImagesCount >= arrImageNames.length) {
                    drawCardImage();
                }
            };
            let src = 'images/' + arrImageNames[i];

            images[src] = img;
            img.src = src;
        }
    }

    function drawCardText(ctx) {
        let lines = currentCard.text.split('\n');
        let fontSize = 0;
        switch(lines.length){
            case 1:
            case 2:
            case 3:
                fontSize = 22;
                break;
            case 4:
                fontSize = 18;
                break;
            case 5:
                fontSize = 14;
                break;
            default:
                fontSize = 12;
                break;
        }
        let lineHeight = fontSize + 4;
        let ySpan = 30;
        let yText = 525 - (lines.length * (fontSize / 2));

        let data = '<svg xmlns="http://www.w3.org/2000/svg" width="280" height="120">' +
            '<text font-size="'+fontSize+'" font-family="Rubik" fill="#D3C6A9" text-anchor="middle">';

        let boldRegex = /\[([^\]]+)\]/g;
        for(let i=0; i < lines.length; i++) {
            let line = lines[i];
            let bold = boldRegex.exec(line);
            while(bold) {
                let boldPart = line.substr(bold.index + 1, bold[1].length);
                line = line.replace(bold[0], '<tspan font-weight="700">' + boldPart + '</tspan>');
                bold = boldRegex.exec(line);
            }

            data += '<tspan y="'+ySpan+'" x="140" >' + line + '</tspan>';
            ySpan += lineHeight;
        }

        data += '</text>'+'</svg>';

        let img = new Image();
        let svg = new Blob([data], {type: 'image/svg+xml'});
        let url = URL.createObjectURL(svg);
        img.onload = function () {
            ctx.drawImage(img, 80, yText);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }

    function cropImage(img, width, height) {
        let canvasCrop = document.getElementById('CropCanvas');
        let imgCropContainer = document.getElementById('CropContainer');
        canvasCrop.width = width;
        canvasCrop.height = height;
        let ctx = canvasCrop.getContext('2d');
        let ratio = 1;

        if(img.width > img.height && img.width > width)
            ratio = width / img.width;

        if(img.height >= img.width && img.height > height)
            ratio = height / img.height;

        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        let destWidth = img.width * ratio;
        let destHeight = img.height * ratio;
        let destX = width / 2 - destWidth / 2;
        let destY = height / 2 - destHeight / 2;

        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        imgCropContainer.onload = function(){
            currentCard.art = this;
            drawCardImage();
        };
        imgCropContainer.src =   canvasCrop.toDataURL();
    }
};