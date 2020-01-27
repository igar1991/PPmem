import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import View from '@vkontakte/vkui/dist/components/View/View';
import ScreenSpinner from '@vkontakte/vkui/dist/components/ScreenSpinner/ScreenSpinner';
import '@vkontakte/vkui/dist/vkui.css';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import File from '@vkontakte/vkui/dist/components/File/File';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import './panels/Persik.css';
import Persik from './img/persik.jpg';
import {baseText} from './text';



const App = () => {
	const [imagePreviewUrl, setImagePreviewUrl] = useState(Persik);
	const [canvasW, setCanvasW] = useState(null);
	const [canvasH, setCanvasH] = useState(null);
	const [drowTxt, setdrowTxt] = useState("Загрузи фото и добавь надпись!");
	const [canva, setCanva] = useState(null);
	
    
	useEffect(() => {
		//if(imagePreviewUrl==null) {connect.sendPromise("VKWebAppGetUserInfo", {}).then((result)=>{
		//	setImagePreviewUrl(result.photo_200);
		//	setPopout(null);
		//});}
		let img = new Image();
		
		img.src = imagePreviewUrl;
		img.onload = function () {
			let kof = img.height / img.width;
			img.width = window.innerWidth;
			img.height = img.width * kof;
			setCanvasH(img.height);
			setCanvasW(img.width)
			const canvas = document.getElementById('canvas');
			const ctx = canvas.getContext('2d');
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, img.width, img.height);
			ctx.font =`${canvasW*0.1}px 'Lobster'`;
			ctx.fillStyle = "#fff";
			ctx.strokeStyle = "black";
			ctx.lineWidth = 5;
			ctx.textBaseline = "hanging";
            ctx.textAlign = "center";
			wrapText(ctx,drowTxt, canvasW*0.5, canvasH-5-canvasW*0.1, canvasW, canvasW*0.1, true );
			setCanva(canvas);
		}
	}, [imagePreviewUrl, drowTxt, canvasH, canvasW]);

	const photoUpload = e => {
		e.preventDefault();
		const reader = new FileReader();
		const file = e.target.files[0];
		reader.onloadend = () => {
			setImagePreviewUrl(reader.result);
		}
		if (file) {
			reader.readAsDataURL(file);
		}
	}

	const blobToBase64 = (blob, cb) => {
		let reader = new FileReader();
		reader.onload = function () {
			let dataUrl = reader.result;
			let base64 = dataUrl.split(',')[1];
			cb(base64);
		};
		reader.readAsDataURL(blob);
	};

	const history = async () => {
		canva.toBlob(function (blob) {
			blobToBase64(blob, (base64) => {
				connect.sendPromise("VKWebAppShowStoryBox", { "background_type": "image", "blob": base64, "attachment": { "text": "hello", "type": "url", "url": "https://vk.com/app7279933" } }).then(result => {

				}).catch(res => {
					console.log(res);
				})
			})
			console.log("dddd")
		});

	}

	const wrapText=(context, text, x, y, maxWidth, lineHeight, fromBottom) => {

        let pushMethod = (fromBottom) ? 'unshift' : 'push';

        lineHeight = (fromBottom) ? -lineHeight : lineHeight;

        let lines = [];
        let line = '';
        let words = text.split(' ');

        for (let n = 0; n < words.length; n++) {
            let testLine = line + ' ' + words[n];
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth) {
                lines[pushMethod](line);
                line = words[n] + ' ';
            } else {

                line = testLine;

            }
        }
        lines[pushMethod](line);

        for (let k in lines) {
            context.strokeText(lines[k], x, y + lineHeight * k);
            context.fillText(lines[k], x, y + lineHeight * k);
        }
	}
	
	const randomInteger = (min, max) => {
        let rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);
    }

	return (
		<View>
			<Panel>
				<PanelHeader>Твоя Постирония</PanelHeader>
				<Group title="Создание мема">
					{canvasH != null && <canvas id='canvas' width={canvasW} height={canvasH}></canvas>}
					<Div>
						<File size="xl" level="2" onChange={photoUpload}>
							Загрузить фото
                        </File>
						<Button size="xl" onClick={()=>setdrowTxt(baseText[randomInteger(0,baseText.length-1)])}>
							Добавить надпись
				        </Button>
						<Button size="xl" level="commerce" onClick={history}>
							Поделиться
					</Button>
					</Div>
				</Group>
			</Panel>
		</View>
	);
}

export default App;

