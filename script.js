
window.onload = function() {
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
    let inpArtAttribution = document.getElementById('ArtAttribution');
    let txtCardText = document.getElementById('CardText');
    let btnSaveImage = document.querySelector('.btn-save_image');

    let images = [];
    let currentCard = {
        art: '',
        artX: 0,
        artY: 0,
        artAttribution: '',
        supportShout: '',
        frame: 'mono_neutral',
        health: '4',
        magicka: '5',
        power: '3',
        rarity: 'epic',
        type: 'Player',
        text: '[Summon]: Keep hope until\nall issues with the\nnew client are resolved.\n(a) (e) (i) (n) (s) (w)',
        title: 'Forgotten Hero'
    };

    loadValues(currentCard);

    let WebFontConfig = {
        active: function () {
            preloadImages();
        },
        google: {
            families: ['Merriweather:300,400,700', 'Rubik:400,700,900', 'Ubuntu:300,400,700,900']
        }
    };
    WebFont.load(WebFontConfig);

    selectCardClass.onchange = function () {
        currentCard.frame = this.value;
        checkRarityForDuoTrio();
        drawCardImage();
    };

    selectCardRarity.onchange = function () {
        checkRarityForDuoTrio();
        drawCardImage();
    };

    inpCardTitle.onkeyup = function () {
        currentCard.title = this.value;
        drawCardImage();
    };

    inpCardMagicka.onkeyup = function () {
        currentCard.magicka = this.value;
        drawCardImage();
    };

    inpCardPower.onkeyup = function () {
        currentCard.power = this.value;
        drawCardImage();
    };

    inpCardHealth.onkeyup = function () {
        currentCard.health = this.value;
        drawCardImage();
    };

    inpSupportShout.onkeyup = function () {
        currentCard.supportShout = this.value;
        drawCardImage();
    };

    txtCardText.onkeyup = function () {
        currentCard.text = this.value;
        drawCardImage();
    };

    inpCardType.onkeyup = function () {
        currentCard.type = this.value;
        drawCardImage();
    };

    inpArtAttribution.onkeyup = function () {
        currentCard.artAttribution = this.value;
        drawCardImage();
    };

    inpCardArt.onchange = function () {
        if (inpCardArt.files.length !== 1) return;
        let file = inpCardArt.files[0];
        let img = new Image();
        if (file.type.match('image.*')) {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (evt) {
                if (evt.target.readyState === FileReader.DONE) {
                    img.src = evt.target.result;
                    img.onload = function () {

                        currentCard.art = cropImage(img, 320, 420);
                    };
                }
            }
        }
    };

    btnSaveImage.onclick = function (e) {
        canvas.toBlob(function (blob) {
            let downloadName = "image.png";
            if (currentCard.title) {
                downloadName = currentCard.title.replace(/[^a-zA-Z0-9]/g, '-') + '.png';
            }

            let a = document.createElement('A');
            a.download = downloadName;
            a.href = window.URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        }, "image/png");
    };

    function loadValues(card) {
        selectCardClass.value = card.frame;
        selectCardRarity.value = card.rarity;
        inpCardTitle.value = card.title;
        inpCardType.value = card.type;
        inpCardMagicka.value = card.magicka;
        inpCardPower.value = card.power;
        inpCardHealth.value = card.health;
        inpSupportShout.value = card.supportShout;
        txtCardText.value = card.text;
    }

    function checkRarityForDuoTrio() {
        currentCard.rarity = selectCardRarity.value;
        if (currentCard.rarity.indexOf('legendary') >= 0) {
            if (currentCard.frame.indexOf('duo_') >= 0)
                currentCard.rarity += '_duo';
            else if (currentCard.frame.indexOf('trio_') >= 0)
                currentCard.rarity += '_trio';
        }
    }

    function drawCardImage() {
        let ctx = canvas.getContext("2d");

        let layerArt = getImageForLayer('art');
        let layerFrame = getImageForLayer('frame');
        let layerRarity = getImageForLayer('rarity');
        let layerSupport = getImageForLayer('support');
        let layerPH = getImageForLayer('ph');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (layerArt) ctx.drawImage(layerArt, 60, 120, 320, 420);
        if (layerFrame) ctx.drawImage(layerFrame, 0, 0);
        if (layerRarity) ctx.drawImage(layerRarity, 0, 0);
        if (layerSupport) ctx.drawImage(layerSupport, 0, 0);
        else if (layerPH) ctx.drawImage(layerPH, 0, 0);

        //Magicka
        ctx.textAlign = "center";
        ctx.font = 'bold 54px Ubuntu';
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';
        ctx.strokeText(currentCard.magicka, 65, 110);
        ctx.fillText(currentCard.magicka, 65, 110);

        if (currentCard.supportShout) {
            //Support
            ctx.textAlign = "center";
            ctx.font = '700 16px Merriweather';
            ctx.fillStyle = '#111';
            ctx.fillText(currentCard.supportShout, 220, 488);
        } else if (currentCard.power && currentCard.health) {
            //Power & Health
            ctx.textAlign = "center";
            ctx.font = 'bold 52px Ubuntu';
            ctx.fillStyle = '#FDF6DF';
            ctx.fillText(currentCard.power, 65, 415);
            ctx.fillText(currentCard.health, 375, 415);
        }

        //Type
        ctx.textAlign = "center";
        ctx.font = '300 14px Merriweather';
        ctx.fillStyle = '#E0DDb9';
        ctx.fillText(currentCard.type, 220, 130);

        //Title
        let titleFontSize = currentCard.title.length >= 28 ? 14
            : currentCard.title.length >= 20 ? 18 : 24;
        ctx.textAlign = "center";
        ctx.font = 'bold ' + titleFontSize + 'px Merriweather';
        ctx.fillStyle = '#FDF6DF';
        ctx.fillText(currentCard.title, 230, 105);

        //ArtAttribution
        if(currentCard.artAttribution) {
            ctx.textAlign = "center";
            ctx.font = '300 12px Merriweather';
            let ardAttrTop = currentCard.supportShout ? 460 : 480;
            let wAA = ctx.measureText(currentCard.artAttribution);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(230 - wAA.width / 2 - 16, ardAttrTop - 16, wAA.width + 16, 24);
            ctx.fillStyle = '#FDF6DF';
            ctx.fillText(currentCard.artAttribution, 230 - 8, ardAttrTop);
        }

        //Text
        drawCardText(ctx);
    }

    function getImageForLayer(layer) {
        let src = '';
        switch (layer) {
            case 'art':
                if (currentCard.art) return currentCard.art;
                src = 'art_default.png';
                break;
            case 'frame':
                src = 'frame_' + currentCard.frame + '.png';
                break;
            case 'rarity':
                src = 'rarity_' + currentCard.rarity + '.png';
                break;
            case 'support':
                src = currentCard.supportShout ? 'support_bg.png' : '';
                break;
            case 'ph':
                if (currentCard.power && currentCard.health)
                    src = 'power_health_bg.png';
                break;
        }

        if (src === '') return null;
        return images['images/' + src];
    }

    function preloadImages() {
        let arrImageNames = [
            'art_default.png',
            'attribute_agility.png',
            'attribute_endurance.png',
            'attribute_intelligence.png',
            'attribute_neutral.png',
            'attribute_strength.png',
            'attribute_willpower.png',
            'frame_duo_mage.png',
            'frame_duo_warrior.png',
            'frame_mono_strength.png',
            'frame_trio_red_blue_purple.png',
            'frame_trio_tribunal.png',
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
            'rarity_legendary_duo.png',
            'rarity_legendary_trio.png',
            'rarity_legendary_unique.png',
            'rarity_legendary_unique_duo.png',
            'rarity_legendary_unique_trio.png',
            'power_health_bg.png'
        ];
        let loadedImagesCount = 0;

        for (let i in arrImageNames) {
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

    function generateTextParts(line) {
        let parts = [];

        let regex = new RegExp(/(\[[^\]]+\])|(\([aeinsw]\))|([^()\[\]]*)/g);
        let matches = line.match(regex);

        for (let i = 0; i < matches.length; i++) {
            let text = matches[i];
            if (!text) continue;

            let currentPart = new LinePart();
            if (text[0] === '[') {
                currentPart.IsBold = true;
                currentPart.Text = text.substr(1, text.length - 2);
            } else if (text[0] === '(') {
                currentPart.AttributeIcon = getAttributeIcon(text[1]);
            } else {
                currentPart.Text = text;
            }

            parts.push(currentPart);
        }

        return parts;
    }

    function calculateTextPartsLength(ctx, fontSize, lineTextParts) {
        let totalLineWidth = 0;
        for (let p = 0; p < lineTextParts.length; p++) {
            let part = lineTextParts[p];

            if (part.AttributeIcon) {
                totalLineWidth += fontSize;
                continue;
            }

            ctx.strokeStyle = '#D3C6A9';
            ctx.font = fontSize + 'px Rubik';
            ctx.textAlign="left";

            if (part.IsBold) ctx.font = 'bold ' + ctx.font;
            totalLineWidth += ctx.measureText(part.Text).width;
        }
        return totalLineWidth;
    }

    function drawTextParts(ctx, yText, fontSize, lineTextParts) {
        let totalLineWidth = calculateTextPartsLength(ctx, fontSize, lineTextParts);

        let xCurrent = canvas.width / 2 - totalLineWidth / 2;

        //draw all parts of the current line from left to right
        for (let p = 0; p < lineTextParts.length; p++) {
            let part = lineTextParts[p];

            if (part.AttributeIcon) {
                let img = images['images/' + part.AttributeIcon];
                let imgHeight = fontSize;
                ctx.drawImage(img, xCurrent, yText - imgHeight + (fontSize / 5), imgHeight, imgHeight);
                xCurrent += fontSize;
                continue;
            }

            ctx.fillStyle = '#D3C6A9';
            ctx.font = fontSize + 'px Rubik';
            ctx.textAlign="left";

            if (part.IsBold) ctx.font = 'bold ' + ctx.font;
            ctx.fillText(part.Text, xCurrent, yText);
            xCurrent += ctx.measureText(part.Text).width;

        }
    }

    function drawCardText(ctx) {
        let lines = currentCard.text.split('\n');
        let fontSize = calculateFontSize(lines.length);
        let yText = 555 - (lines.length * (fontSize / 2));
        let lineHeight = fontSize + 4;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let lineTextParts = generateTextParts(line);

            drawTextParts(ctx, yText, fontSize, lineTextParts);
            yText += lineHeight;
        }
    }

    function cropImage(img, width, height) {
        let canvasCrop = document.getElementById('CropCanvas');
        let imgCropContainer = document.getElementById('CropContainer');
        canvasCrop.width = width;
        canvasCrop.height = height;
        let ctx = canvasCrop.getContext('2d');

        let offsetX = 0.5;
        let offsetY = 0.5;

        let iw = img.width,
            ih = img.height,
            r = Math.min(width / iw, height / ih),
            nw = iw * r,   // new prop. width
            nh = ih * r,   // new prop. height
            cx, cy, cw, ch, ar = 1;

        // decide which gap to fill
        if (nw < width) ar = width / nw;
        if (Math.abs(ar - 1) < 1e-14 && nh < height) ar = height / nh;  // updated
        nw *= ar;
        nh *= ar;

        // calc source rectangle
        cw = iw / (nw / width);
        ch = ih / (nh / height);

        cx = (iw - cw) * offsetX;
        cy = (ih - ch) * offsetY;

        // make sure source rectangle is valid
        if (cx < 0) cx = 0;
        if (cy < 0) cy = 0;
        if (cw > iw) cw = iw;
        if (ch > ih) ch = ih;

        ctx.drawImage(img, cx, cy, cw, ch, 0, 0, width, height);

        imgCropContainer.onload = function () {
            currentCard.art = this;
            drawCardImage();
        };
        imgCropContainer.src = canvasCrop.toDataURL();
    }

    function getAttributeIcon(char) {
        switch (char) {
            case 'a':
                return 'attribute_agility.png';
            case 'e':
                return 'attribute_endurance.png';
            case 'i':
                return 'attribute_intelligence.png';
            case 'n':
                return 'attribute_neutral.png';
            case 's':
                return 'attribute_strength.png';
            case 'w':
                return 'attribute_willpower.png';
        }
        return '';
    }

    function calculateFontSize(lineCount) {
        switch (lineCount) {
            case 1:
            case 2:
            case 3:
                return 22;
            case 4:
                return 18;
            case 5:
                return 14;
            default:
                return 12;
        }
    }

    function LinePart() {
        this.IsBold = false;
        this.AttributeIcon = null;
        this.Text = '';
    }
};