////////////////////////////////////////////////////////////
// GAME v1.5
////////////////////////////////////////////////////////////

/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

//icons array
var iconsArr = [
	{o:'assets/icon_o_1.png', x:'assets/icon_x_1.png'},
	{o:'assets/icon_o_2.png', x:'assets/icon_x_2.png'},
	{o:'assets/icon_o_3.png', x:'assets/icon_x_3.png'},
	{o:'assets/icon_o_4.png', x:'assets/icon_x_4.png'},
	{o:'assets/icon_o_6.png', x:'assets/icon_x_6.png'},
	{o:'assets/icon_5.png', x:'assets/icon_5.png'},
]

//classic settings
var defaultSettings = {
	twoPlayer:true,
	row:6,
	column:7,
	connect:4
};

//custom settings
var customSettings = {
	enable:true,
	twoPlayer:true,
	rowMin:6,
	rowMax:8,
	columnMin:7,
	columnMax:9,
	connectMin:4,
	connectMax:6,
};

//board settings
var boardSettings = {
	radius:35,
	margin:10,
	color:'#7661d1',
	winColor:'#321699',
	winAlpha:.5,
	shadowColor:'#2a27a0',
	shadowOffsetX:0,
	shadowOffsetY:-10,
	borderColor:'#28159b',
	borderStroke:10,
	borderRadius:20,
	borderMargin:10,
	timer:120000
};

//game text display
var textDisplay = {
	customTitle:'Custom Board',
	customSize:'[COLUMN] x [ROW] size',
	customWin:'connect [NUMBER]',
	vs:'VS',
	player1:'Player 1',
	player2:'Player 2',
	computer:'Computer',
	userTurn:'Your turn',
	playerTurn:'[NAME] turn',
	computerTurn:'Computer turn',
	gameWin:'[NUMBER] win',
	draw:'Draw',
	timeUp:'Time\'s Up',
	exitTitle:'Exit Game',
	exitMessage:'Are you sure you want\nto quit game?',
	share:'Share your score:',
	resultTitle:'Game Over',
	resultDesc:'you won [NUMBER] round',
}

//Social share, [SCORE] will replace with game score
var shareEnable = true; //toggle share
var shareTitle = 'Highscore on Connect Four is [SCORE]pts';//social share score title
var shareMessage = '[SCORE]pts is mine new highscore on Connect Four game! Try it now!'; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
$.editor = {enable:false};
var playerData = {score:0, opponentScore:0};
var gameData = {paused:true, moving:false, icon:0, iconSwitch:false, icons:['o','x'], type:'classic', custom:{row:0, column:0, connect:0}, settings:{}, turn:0, player:0, ai:false, aiMove:false, complete:false};
var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0};
var strokeData = {x:0, y:0};
var tweenData = {score:0, tweenScore:0};

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
function buildGameButton(){
	buttonClassic.cursor = "pointer";
	buttonClassic.addEventListener("click", function(evt) {
		playSound('soundButton');
		gameData.type = 'classic';
		toggleMainButton('players');
	});

	buttonCustom.cursor = "pointer";
	buttonCustom.addEventListener("click", function(evt) {
		playSound('soundButton');
		gameData.type = 'custom';
		toggleMainButton('players');
	});

	buttonOnePlayer.cursor = "pointer";
	buttonOnePlayer.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameType(true);
	});

	buttonTwoPlayer.cursor = "pointer";
	buttonTwoPlayer.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkGameType(false);
	});

	buttonLocal.cursor = "pointer";
	buttonLocal.addEventListener("click", function(evt) {
		playSound('soundButton');
		socketData.online = false;
		toggleMainButton('default');
	});

	buttonOnline.cursor = "pointer";
	buttonOnline.addEventListener("click", function(evt) {
		playSound('soundButton');
		checkQuickGameMode();
	});

	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
			if(multiplayerSettings.localPlay){
				toggleMainButton('local');
			}else{
				checkQuickGameMode();
			}
		}else{
			goPage('select');
		}
	});

	buttonRowL.cursor = "pointer";
	buttonRowL.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomRow(false);
	});

	buttonRowR.cursor = "pointer";
	buttonRowR.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomRow(true);
	});

	buttonColumnL.cursor = "pointer";
	buttonColumnL.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomColumn(false);
	});

	buttonColumnR.cursor = "pointer";
	buttonColumnR.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomColumn(true);
	});

	buttonWinL.cursor = "pointer";
	buttonWinL.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomConnect(false);
	});

	buttonWinR.cursor = "pointer";
	buttonWinR.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleCustomConnect(true);
	});

	buttonCustomStart.cursor = "pointer";
	buttonCustomStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('players');
		}else{
			goPage('players');
		}
	});

	buttonPlayersIcon.cursor = "pointer";
	buttonPlayersIcon.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleGameIcon();
	});

	buttonPlayersSwitch.cursor = "pointer";
	buttonPlayersSwitch.addEventListener("click", function(evt) {
		playSound('soundButton2');
		toggleGameIconSide();
	});

	buttonPlayersStart.cursor = "pointer";
	buttonPlayersStart.addEventListener("click", function(evt) {
		playSound('soundButton');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			postSocketUpdate('start');
		}else{
			goPage('game');
		}
	});
	
	itemExit.addEventListener("click", function(evt) {
	});
	
	buttonContinue.cursor = "pointer";
	buttonContinue.addEventListener("click", function(evt) {
		playSound('soundButton');
		goPage('main');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleGameMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleGameMute(false);
	});
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		togglePop(true);
		toggleOption();
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
		
		stopAudio();
		stopGame();
		goPage('main');
		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			exitSocketRoom();
		}
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundButton');
		togglePop(false);
	});

	gameData.custom.column = customSettings.columnMin;
	gameData.custom.row = customSettings.rowMin;
	gameData.custom.connect = customSettings.connectMin;
	checkCustomSettings();
	displayPlayerIcon();
}

/*!
 * 
 * TOGGLE GAME TYPE - This is the function that runs to toggle game type
 * 
 */
function toggleMainButton(con){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
		gameLogsTxt.visible = true;
		gameLogsTxt.text = '';
	}

	buttonStart.visible = false;
	buttonTypeContainer.visible = false;
	buttonPlayerContainer.visible = false;
	buttonLocalContainer.visible = false;

	if(con == 'default'){
		buttonTypeContainer.visible = true;
	}else if(con == 'start'){
		buttonStart.visible = true;
	}else if(con == 'local'){
		buttonLocalContainer.visible = true;
	}else if(con == 'players'){
		if(gameData.type == 'classic'){
			if(!defaultSettings.twoPlayer){
				checkGameType(true);
				return;
			}
		}else{
			if(!customSettings.twoPlayer){
				checkGameType(true);
				return;
			}
		}

		buttonPlayerContainer.visible = true;
	}
}

function checkGameType(con){
	gameData.ai = con;
	if(gameData.type == 'classic'){
		goPage('players');
	}else{
		goPage('custom');
	}
}

function checkQuickGameMode(){
	socketData.online = true;
	if(!multiplayerSettings.enterName){
		buttonStart.visible = false;
		buttonTypeContainer.visible = false;
		buttonPlayerContainer.visible = false;
		buttonLocalContainer.visible = false;

		addSocketRandomUser();
	}else{
		goPage('name');
	}
}

function toggleCustomRow(con){
	if(con){
		gameData.custom.row++;
		gameData.custom.row = gameData.custom.row > customSettings.rowMax ? customSettings.rowMax : gameData.custom.row;
	}else{
		gameData.custom.row--;
		gameData.custom.row = gameData.custom.row < customSettings.rowMin ? customSettings.rowMin : gameData.custom.row;
	}

	gameData.custom.connect = gameData.custom.connect > gameData.custom.row ? gameData.custom.row : gameData.custom.connect;
	gameData.custom.connect = gameData.custom.connect > gameData.custom.column ? gameData.custom.column : gameData.custom.connect;
	gameData.custom.connect = gameData.custom.connect < customSettings.connectMin ? customSettings.connectMin : gameData.custom.connect;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updatecustom', {row:gameData.custom.row, column:gameData.custom.column, connect:gameData.custom.connect});
	}else{
		checkCustomSettings();
	}
}

function toggleCustomColumn(con){
	if(con){
		gameData.custom.column++;
		gameData.custom.column = gameData.custom.column > customSettings.columnMax ? customSettings.columnMax : gameData.custom.column;
	}else{
		gameData.custom.column--;
		gameData.custom.column = gameData.custom.column < customSettings.columnMin ? customSettings.columnMin : gameData.custom.column;
	}

	gameData.custom.connect = gameData.custom.connect > gameData.custom.row ? gameData.custom.row : gameData.custom.connect;
	gameData.custom.connect = gameData.custom.connect > gameData.custom.column ? gameData.custom.column : gameData.custom.connect;
	gameData.custom.connect = gameData.custom.connect < customSettings.connectMin ? customSettings.connectMin : gameData.custom.connect;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updatecustom', {row:gameData.custom.row, column:gameData.custom.column, connect:gameData.custom.connect});
	}else{
		checkCustomSettings();
	}
}

function toggleCustomConnect(con){
	if(con){
		gameData.custom.connect++;
		gameData.custom.connect = gameData.custom.connect > gameData.custom.row ? gameData.custom.row : gameData.custom.connect;
		gameData.custom.connect = gameData.custom.connect > gameData.custom.column ? gameData.custom.column : gameData.custom.connect;
		gameData.custom.connect = gameData.custom.connect > customSettings.connectMax ? customSettings.connectMax : gameData.custom.connect;
	}else{
		gameData.custom.connect--;
		gameData.custom.connect = gameData.custom.connect < customSettings.connectMin ? customSettings.connectMin : gameData.custom.connect;
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updatecustom', {row:gameData.custom.row, column:gameData.custom.column, connect:gameData.custom.connect});
	}else{
		checkCustomSettings();
	}
}

function checkCustomSettings(){
	var customSize = textDisplay.customSize.replace('[COLUMN]', gameData.custom.column);
	customSize = customSize.replace('[ROW]', gameData.custom.row);

	sizeTxt.text = customSize;
	connectTxt.text = textDisplay.customWin.replace('[NUMBER]', gameData.custom.connect);
}

function toggleGameIcon(){
	gameData.icon++;
	gameData.icon = gameData.icon > iconsArr.length-1 ? 0 : gameData.icon;

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updateplayers', {icon:gameData.icon, switch:gameData.iconSwitch, icons:gameData.icons});
	}else{
		displayPlayerIcon();
	}
}

function toggleGameIconSide(){
	gameData.iconSwitch = gameData.iconSwitch == true ? false : true;
	if(gameData.iconSwitch){
		gameData.icons = ['x','o'];
	}else{
		gameData.icons = ['o','x'];
	}

	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		postSocketUpdate('updateplayers', {icon:gameData.icon, switch:gameData.iconSwitch, icons:gameData.icons});
	}else{
		displayPlayerIcon();
	}
}

function displayPlayerIcon(){
	for(var n=0; n<2; n++){
		$.players['playerIconContainer'+ n].removeAllChildren();
		
		var iconID = 'icon'+gameData.icon+gameData.icons[n];
		$.players['playerIcon'+ n] = new createjs.Bitmap(loader.getResult(iconID));
		centerReg($.players['playerIcon'+ n]);

		$.players['playerIcon'+ n].y = -20;
		$.players['playerIcon'+ n].scaleX = $.players['playerIcon'+ n].scaleY = 1.3;

		$.players['playerIconContainer'+ n].addChild($.players['playerIcon'+ n]);
	}
}

function resizeSocketLog(){
	gameLogsTxt.font = "30px bpreplaybold";
	gameLogsTxt.textAlign = "center";
	gameLogsTxt.color = "#ccc";

	if(curPage == 'main'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 75;
		}
	}else if(curPage == 'custom'){
		if(viewport.isLandscape){
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 67;
		}else{
			gameLogsTxt.x = canvasW/2;
			gameLogsTxt.y = canvasH/100 * 65;
		}
	}
}

/*!
 * 
 * TOGGLE POP - This is the function that runs to toggle popup overlay
 * 
 */
function togglePop(con){
	confirmContainer.visible = con;
}


/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
var curPage=''
function goPage(page){
	curPage=page;

	$('#roomWrapper').hide();
	$('#roomWrapper .innerContent').hide();
	gameLogsTxt.visible = false;
	
	mainContainer.visible = false;
	nameContainer.visible = false;
	roomContainer.visible = false;
	customContainer.visible = false;
	playersContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			if ( typeof initSocket == 'function' && multiplayerSettings.enable) {
				toggleMainButton('start');
			}else{
				toggleMainButton('default');
			}
		break;

		case 'name':
			targetContainer = nameContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .nameContent').show();
			$('#roomWrapper .fontNameError').html('');
			$('#enterName').show();
		break;
			
		case 'room':
			targetContainer = roomContainer;
			$('#roomWrapper').show();
			$('#roomWrapper .roomContent').show();
			switchSocketRoomContent('lists');
		break;

		case 'custom':
			targetContainer = customContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonCustomStart.visible = false;
				buttonRowL.visible = buttonRowR.visible = false;
				buttonColumnL.visible = buttonColumnR.visible = false;
				buttonWinL.visible = buttonWinR.visible = false;

				if(socketData.host){
					buttonCustomStart.visible = true;
					buttonRowL.visible = buttonRowR.visible = true;
					buttonColumnL.visible = buttonColumnR.visible = true;
					buttonWinL.visible = buttonWinR.visible = true;
				}
			}
		break;

		case 'players':
			targetContainer = playersContainer;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				buttonPlayersStart.visible = false;
				buttonPlayersIcon.visible = false;
				buttonPlayersSwitch.visible = false;

				if(socketData.host){
					buttonPlayersStart.visible = true;
					buttonPlayersIcon.visible = true;
					buttonPlayersSwitch.visible = true;
				}
			}else{
				if(gameData.ai){
					$.players['player'+ 1].text = textDisplay.computer;
				}else{
					$.players['player'+ 1].text = textDisplay.player2;
				}
			}
		break;
		
		case 'game':
			targetContainer = gameContainer;

			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame();
			togglePop(false);
			
			playSound('soundResult');
			
			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				var playerScore = playerData.score;
				if(!socketData.host){
					playerScore = playerData.opponentScore;
				}
				TweenMax.to(tweenData, .5, {tweenScore:playerScore, overwrite:true, onUpdate:function(){
					resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', Math.floor(tweenData.tweenScore));
				}});
				
				if(socketData.host){
					postSocketCloseRoom();
				}

				saveGame(playerScore);
			}else{
				TweenMax.to(tweenData, .5, {tweenScore:playerData.score, overwrite:true, onUpdate:function(){
					resultDescTxt.text = textDisplay.resultDesc.replace('[NUMBER]', Math.floor(tweenData.tweenScore));
				}});

				saveGame(playerData.score);
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

/*!
 * 
 * START GAME - This is the function that runs to start game
 * 
 */
function startGame(){
	gameData.paused = false;
	gameData.complete = false;
	gameData.turn = 0;
	gameData.player = 0;
	gameData.moving = false;

	buildPlayers();

	if(gameData.type == 'classic'){
		gameData.settings = {
			row:defaultSettings.row,
			column:defaultSettings.column,
			connect:defaultSettings.connect
		};
	}else{
		gameData.settings = {
			row:gameData.custom.row,
			column:gameData.custom.column,
			connect:gameData.custom.connect
		};
	}

	timeData.oldTimer = -1;
	timeData.countdown = boardSettings.timer;
	timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.countdown);
	timerRedTxt.alpha = 0;

	statusContainer.alpha = 0;

	buildBoard();
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		if(socketData.host){
			toggleGameTimer(true);
		}
	}else{
		toggleGameTimer(true);
	}
	
}

 /*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */
 function stopGame(){
	boardDesignContainer.removeAllChildren();
	boardDesignBackContainer.removeAllChildren();
	boardIconContainer.removeAllChildren();

	gameData.paused = true;
	TweenMax.killAll(false, true, false);
}

function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * BUILD PLAYERS - This is the function that runs to build players
 * 
 */
function buildPlayers(){
	for(var n=0; n<2; n++){
		$.players['gameIconContainer'+ n].removeAllChildren();

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {

		}else{
			if(n == 1){
				if(gameData.ai){
					$.players['gamePlayer'+ 1].text = textDisplay.computer;
				}else{
					$.players['gamePlayer'+ 1].text = textDisplay.player2;
				}
			}
		}

		$.players['gameTurn'+ n].text = '';

		var iconID = 'icon'+gameData.icon+gameData.icons[n];
		$.players['gameIcon'+ n] = new createjs.Bitmap(loader.getResult(iconID));
		centerReg($.players['gameIcon'+ n]);

		$.players['gameIcon'+ n].y = -35;
		$.players['gameIcon'+ n].scaleX = $.players['gameIcon'+ n].scaleY = 1.3;

		$.players['gameIconContainer'+ n].addChild($.players['gameIcon'+ n]);
	}

	playerData.score = 0;
	playerData.opponentScore = 0;
	displayPlayerScore();
}

/*!
 * 
 * BUILD BOARD - This is the function that runs to build board
 * 
 */
function buildBoard(){
	playSound('soundStart');

	boardDesignContainer.removeAllChildren();
	boardDesignBackContainer.removeAllChildren();
	boardIconContainer.removeAllChildren();

	gameData.complete = false;
	gameData.settings.aiMove = false;
	gameData.design = [];
	gameData.designBack = [];
	gameData.board = [];

	var bWidth = (boardSettings.radius * 2) + boardSettings.margin;
	var boardW = (bWidth * (gameData.settings.column)) + boardSettings.margin;
	var boardH = (bWidth * (gameData.settings.row)) + boardSettings.margin;
	var boardWM = (bWidth * (gameData.settings.column)) + boardSettings.margin + (boardSettings.borderMargin * 2);
	var boardHM = (bWidth * (gameData.settings.row)) + boardSettings.margin + (boardSettings.borderMargin * 2);
	var maskWidth = boardSettings.radius + boardSettings.margin;

	var positionData = {x:0, y:0, sX:0, sY:0};
	positionData.sX = -((bWidth * (gameData.settings.column-1))/2);
	positionData.sY = -((bWidth * (gameData.settings.row-1))/2);
	positionData.x = positionData.sX;
	positionData.y = positionData.sY;
	
	boardMask.graphics.clear().beginFill('red').drawRect(-(boardW/2), -(boardH/2), boardW, boardH);
	boardDesignBackContainer.mask = boardMask;

	boardBorder.graphics.clear().setStrokeStyle(boardSettings.borderStroke,"round").beginStroke(boardSettings.borderColor).drawRoundRectComplex(-(boardWM/2), -(boardHM/2), boardWM, boardHM, boardSettings.borderRadius, boardSettings.borderRadius, boardSettings.borderRadius, boardSettings.borderRadius);

	boardColor.graphics.clear().beginFill(boardSettings.color)
	.drawRoundRectComplex(-(boardWM/2), -(boardHM/2), boardWM, boardHM, boardSettings.borderRadius, boardSettings.borderRadius, boardSettings.borderRadius, boardSettings.borderRadius)
	.moveTo(-(boardW/2),-(boardH/2))
	.lineTo(-(boardW/2),(boardH/2))
	.lineTo((boardW/2),(boardH/2))
	.lineTo((boardW/2),-(boardH/2))
	.lineTo(-(boardW/2),-(boardH/2));

	var totalCount = 0;
	for(var r=0; r<gameData.settings.row; r++){
		gameData.design.push([]);
		gameData.designBack.push([]);
		gameData.board.push([]);
		for(var c=0; c<gameData.settings.column; c++){
			var bgWin = new createjs.Shape();
			bgWin.graphics.beginFill(boardSettings.winColor).drawCircle(0,0,boardSettings.radius);
			bgWin.alpha = 0;

			gameData.design[r][c] = new createjs.Shape();
			gameData.design[r][c].graphics.beginFill(boardSettings.color)
			.moveTo(-maskWidth,-maskWidth)
			.lineTo(-maskWidth,maskWidth)
			.lineTo(maskWidth,maskWidth)
			.lineTo(maskWidth,-maskWidth)
			.lineTo(-maskWidth,-maskWidth)
			.closePath()
			.drawCircle(0,0,boardSettings.radius);

			gameData.designBack[r][c] = new createjs.Shape();
			gameData.designBack[r][c].graphics.beginFill(boardSettings.shadowColor)
			.moveTo(-maskWidth,-maskWidth)
			.lineTo(-maskWidth,maskWidth)
			.lineTo(maskWidth,maskWidth)
			.lineTo(maskWidth,-maskWidth)
			.lineTo(-maskWidth,-maskWidth)
			.closePath()
			.drawCircle(0,0,boardSettings.radius);
			
			gameData.design[r][c].hitArea = new createjs.Shape(new createjs.Graphics().beginFill('#000').drawRect(-(maskWidth), -(maskWidth), maskWidth*2, maskWidth*2));	
			boardDesignContainer.addChild(bgWin, gameData.design[r][c]);
			boardDesignBackContainer.addChild(gameData.designBack[r][c]);

			gameData.design[r][c].x = bgWin.x = positionData.x;
			gameData.design[r][c].y = bgWin.y = positionData.y;
			gameData.designBack[r][c].x = positionData.x + boardSettings.shadowOffsetX;
			gameData.designBack[r][c].y = positionData.y + boardSettings.shadowOffsetY;
			positionData.x += bWidth;

			gameData.design[r][c].row = r;
			gameData.design[r][c].column = c;
			gameData.design[r][c].id = totalCount;
			gameData.design[r][c].bgWin = bgWin;

			gameData.design[r][c].cursor = "pointer";
			gameData.design[r][c].addEventListener("click", function(evt) {
				if(gameData.paused){
					return;
				}
				
				if(gameData.complete){
					return;
				}
			
				if(gameData.moving){
					return;
				}

				if(gameData.ai){
					if(gameData.player == 1){
						return;
					}

					gameData.aiMove = true;
				}

				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					if(!socketData.turn){
						return;
					}
				}
				
				if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
					postSocketUpdate('updatemove', {column:evt.target.column});
				}else{
					placeMove(evt.target.column);
				}
			});
			totalCount++;

			gameData.board[r][c] = -1;
		}

		positionData.x = positionData.sX;
		positionData.y += bWidth;
	}

	statusContainer.y = (boardHM/2);
	
	boardContainer.scaleX = boardContainer.scaleY = 1;
	var minBoardHeight = 480;
	if(boardHM > minBoardHeight){
		var boardScale = minBoardHeight/boardHM;
		boardContainer.scaleX = boardContainer.scaleY = boardScale;
	}

	if(gameData.player == 1 && gameData.ai){
		makeAIMove();
	}

	displayPlayerTurn();
}

/*!
 * 
 * DISPLAY PLAYER TURN - This is the function that runs to display playter turn
 * 
 */
function displayPlayerTurn(){
	for(var n=0; n<2; n++){
		var userTurn = '';
		if(n == gameData.player && !gameData.complete){
			userTurn = textDisplay.userTurn;

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.host){
					userTurn = n == 1 ? textDisplay.playerTurn.replace('[NAME]', $.players['gamePlayer'+ n].text) : userTurn;
				}else{
					userTurn = n == 0 ? textDisplay.playerTurn.replace('[NAME]', $.players['gamePlayer'+ n].text) : userTurn;
				}
			}else{
				if(n == 1 && gameData.ai){
					userTurn = textDisplay.computerTurn;
				}
			}
		}

		$.players['gameTurn'+ n].text = userTurn;

		TweenMax.killTweensOf($.players['gameTurn'+ n]);
		if(userTurn != ''){
			animatePlayerTurn($.players['gameTurn'+ n]);
		}
	}
}

function animatePlayerTurn(obj){
	obj.alpha = .3;
	var tweenSpeed = .2;
	TweenMax.to(obj, tweenSpeed, {alpha:1, overwrite:true, onComplete:function(){
		TweenMax.to(obj, tweenSpeed, {alpha:.3, overwrite:true, onComplete:animatePlayerTurn, onCompleteParams:[obj]});
	}});
}


/*!
 * 
 * ANIMATE TIMER - This is the function that runs to animate countdown
 * 
 */
function animateTimer(){
	timerRedTxt.alpha = 0;
	TweenMax.to(timerRedTxt, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * GAME STATUS - This is the function that runs to show game status
 * 
 */
function showGameStatus(con){
	if(con == 'timer'){
		statusTxt.text = textDisplay.timeUp;
	}else{
		statusTxt.text = textDisplay.draw;
	}

	statusContainer.alpha = 0;
	TweenMax.to(statusContainer, .5, {alpha:1, overwrite:true});
}

/*!
 * 
 * DISPLAY PLAYER SCORE - This is the function that runs to display player score
 * 
 */
function displayPlayerScore(){
	for(var n=0; n<2; n++){
		if(n == 0){
			$.players['gameWin'+ n].text = textDisplay.gameWin.replace('[NUMBER]', playerData.score);
		}else{
			$.players['gameWin'+ n].text = textDisplay.gameWin.replace('[NUMBER]', playerData.opponentScore);
		}
	}
}

/*!
 * 
 * PLACE ICON - This is the function that runs to display icon
 * 
 */
function placeMove(column) {
	if(gameData.moving){
		return;
	}

	var firstEmptyRow = getFirstEmptyRow(column, gameData.board);
	if (firstEmptyRow === -1) {
		return;
	}

	placeIcon(firstEmptyRow, column, gameData.player);
}

function placeIcon(row, column, player){
	//var randomSound = Math.floor(Math.random()*3);
	//playSound('soundDrop'+(randomSound+1));
	playSound('soundTile');

	gameData.moving = true;
	var iconID = gameData.player == 0 ? 'icon'+gameData.icon+gameData.icons[0] : 'icon'+gameData.icon+gameData.icons[1];
	var newIcon = new createjs.Bitmap(loader.getResult(iconID));
	centerReg(newIcon);

	gameData.board[row][column] = gameData.player;
	gameData.design[row][column].icon = newIcon;

	newIcon.x = gameData.design[row][column].x;
	newIcon.y = gameData.design[0][column].y - (boardSettings.radius*2);
	boardIconContainer.addChild(newIcon);

	TweenMax.to( newIcon, .5, {ease:Bounce.easeOut, y:gameData.design[row][column].y, overwrite:true, onComplete:function(){
		checkPlayerStatus(gameData.player);

		if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
			if(socketData.turn){
				setTimeout(function(){
					postSocketUpdate('updatemovecomplete');
				}, 500);
			}
		}
	}});
}

/*!
 * 
 * CHECK PLAYER STATUS - This is the function that runs to check player status
 * 
 */
function checkPlayerStatus(player){
	if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
		
	}else{
		gameData.moving = false;
	}

	var boardComplete = false;
	var tweenTimer = 2.5;
	var connectLine = checkIsWinner(gameData.player, gameData.board);
	if (connectLine.length >= gameData.settings.connect) {
		boardComplete = true;
		gameData.complete = true;
		if(player == 0){
			playerData.score++;
		}else{
			playerData.opponentScore++;
		}
		displayPlayerScore();
		animateConnect(connectLine);
		playSound('soundComplete');
	} else if (checkIsTie(gameData.board)) {
		boardComplete = true;
		tweenTimer = 1.5;
		gameData.complete = true;
		showGameStatus('draw');
		playSound('soundDraw');
	}
	
	if(!boardComplete){
		togglePlayer();
		if(player == 0 && gameData.ai){
			makeAIMove();
		}
		displayPlayerTurn();
	}else {
		displayPlayerTurn();
		gameData.turn = gameData.turn == 1 ? 0 : 1;
		gameData.player = gameData.turn;
		TweenMax.to(gameContainer, tweenTimer, {overwrite:true, onComplete:function(){
			buildBoard();

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				if(socketData.turn){
					postSocketUpdate('updateroundcomplete');
				}
			}
		}});
	}
}

function togglePlayer(){
	gameData.player = gameData.player == 0 ? 1 : 0;
}

/*!
 * 
 * ANIMATE WIN BOARD - This is the function that runs to animate win board
 * 
 */
function animateConnect(line){
	for(var n=0; n<line.length; n++){
		var targetBgWin = gameData.design[line[n][0]][line[n][1]].bgWin;
		var targetIcon = gameData.design[line[n][0]][line[n][1]].icon;
		animateWinDim(targetBgWin);
		animateWinIcon(targetIcon);
	}
}

/*!
 * 
 * ANIMATE WIN ICONS - This is the function that runs to animate win icons
 * 
 */
function animateWinIcon(obj){
	TweenMax.to(obj, .5, {scaleX:1.2, scaleY:1.2, ease:Expo.easeIn, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .5, {scaleX:1, scaleY:1, ease:Expo.easeOut, overwrite:true});
	}});
}

function animateWinDim(obj){
	TweenMax.to(obj, .5, {alpha:boardSettings.winAlpha, overwrite:true, onComplete:function(){
		TweenMax.to(obj, .5, {alpha:0, overwrite:true, onComplete:function(){
		
		}});
	}});
}

/*!
 * 
 * AI MOVE - This is the function that runs for AI move
 * 
 */
function makeAIMove() {
	var bestColumn = getBestColumnForAI();
	var firstEmptyRow = getFirstEmptyRow(bestColumn, gameData.board);

	placeIcon(firstEmptyRow, bestColumn, gameData.player);
}

function getBestColumnForAI() {
	var winnerColumn = getWinnerColumn(gameData.board, gameData.player);
	if (winnerColumn !== -1) {
		return winnerColumn;
	}
	var adversary = gameData.player == 0 ? 1 : 0;

	var winnerColumnForAdversary = getWinnerColumn(gameData.board, adversary);
	if (winnerColumnForAdversary !== -1) {
		return winnerColumnForAdversary;
	}
	var cpuStats = getColumnWithHighestScore(gameData.player, gameData.board);
	var adversaryStats = getColumnWithHighestScore(adversary, gameData.board);
	if (adversaryStats.highestCount > cpuStats.highestCount) {
		return adversaryStats.columnIndex;
	} else if (cpuStats.highestCount > 1) {
		return cpuStats.columnIndex;
	}
	const centralColumn = getCentralColumn(gameData.board);
	if (centralColumn !== -1) {
		return centralColumn;
	}
	return getRandomColumn(gameData.board);

}

function getWinnerColumn(board, player) {
	for (var i = 0; i < gameData.settings.column; i++) {
		var boardClone = JSON.parse(JSON.stringify(board));
		const firstEmptyRow = getFirstEmptyRow(i, boardClone);
		if (firstEmptyRow !== -1) {
			boardClone[firstEmptyRow][i] = player;
			var connectLine = checkIsWinner(player, boardClone);
			if (connectLine.length >= gameData.settings.connect) {
				return i;
			}
		}
	}
	return -1;
}

function getColumnWithHighestScore(player, board) {
	var returnObject = {
		highestCount: -1,
		columnIndex: -1,
	};
	for (var i = 0; i < gameData.settings.column; i++) {
		var boardClone = JSON.parse(JSON.stringify(board));
		var firstEmptyRow = getFirstEmptyRow(i, boardClone);
		if (firstEmptyRow !== -1) {
			boardClone[firstEmptyRow][i] = player;
			const firstFilledRow = getFirstFilledRow(i, boardClone);
			if (firstFilledRow !== -1) {
				var count;
				count = countUp(i, firstFilledRow, player, boardClone);
				if (count.length > returnObject.highestCount) {
					returnObject.highestCount = count;
					returnObject.columnIndex = i;
				}
				count = countRight(i, firstFilledRow, player, boardClone);
				if (count.length > returnObject.highestCount) {
					returnObject.highestCount = count;
					returnObject.columnIndex = i;
				}
				count = countUpRight(i, firstFilledRow, player, boardClone);
				if (count.length > returnObject.highestCount) {
					returnObject.highestCount = count;
					returnObject.columnIndex = i;
				}
				count = countDownRight(i, firstFilledRow, player, boardClone);
				if (count.length > returnObject.highestCount) {
					returnObject.highestCount = count;
					returnObject.columnIndex = i;
				}
			}
		}
	}
	return returnObject;
}

function getRandomColumn(board) {
	while (true) {
		var boardClone = JSON.parse(JSON.stringify(board));
		var randomColumnIndex = randomIntFromInterval(0, gameData.settings.column - 1);
		var firstEmptyRow = getFirstEmptyRow(randomColumnIndex, boardClone);
		if (firstEmptyRow !== -1) {
			return randomColumnIndex;
		}
	}
}

function getCentralColumn(board) {
	var boardClone = JSON.parse(JSON.stringify(board));
	var centralColumn = parseInt((gameData.settings.column - 1) / 2);
	if (getFirstEmptyRow(centralColumn, boardClone) !== -1) {
		return centralColumn;
	}
	return -1;
}

function getFirstFilledRow(columnIndex, board) {
	for (var i = gameData.settings.row - 1; i >= 0; i--) {
		if (board[i][columnIndex] !== -1) {
			return i;
		}
	}
	return -1;
}

function getFirstEmptyRow(columnIndex, board) {
	for (var i = gameData.settings.row - 1; i >= 0; i--) {
		if (board[i][columnIndex] === -1) {
			return i;
		}
	}
	return -1;
}

function countUp(c, r, player, board) {
	var startr = (r - gameData.settings.connect >= 0) ? r - gameData.settings.connect + 1 : 0;
	var line = [];
	for (; startr <= r; startr++) {
		if (board[startr][c] === player) {
			line.push([startr, c]);
		} else {
			line.length = 0;
		}
	}
	return line;
}

function countRight(c, r, player, board) {
	var endc = (c + gameData.settings.connect < gameData.settings.column) ? c + gameData.settings.connect - 1 : gameData.settings.column - 1;
	var line = [];
	for (; c <= endc; c++) {
		if (board[r][c] === player) {
			line.push([r, c]);
		} else {
			line.length = 0;
		}
	}
	return line;
}

function countUpRight(c, r, player, board) {
	var endc = (c + gameData.settings.connect < gameData.settings.column) ? c + gameData.settings.connect - 1 : gameData.settings.column - 1;
	var startr = (r - gameData.settings.connect >= 0) ? r - gameData.settings.connect + 1 : 0;
	var line = [];
	while (c <= endc && startr <= r) {
		if (board[r][c] === player) {
			line.push([r, c]);
		} else {
			line.length = 0;
		}
		c++;
		r--;
	}
	return line;
}

function countDownRight(c, r, player, board) {
	var endc = (c + gameData.settings.connect < gameData.settings.column) ? c + gameData.settings.connect - 1 : gameData.settings.column - 1;
	var endr = (r + gameData.settings.connect < gameData.settings.row) ? r + gameData.settings.connect - 1 : gameData.settings.row - 1;
	var line = [];
	while (c <= endc && r <= endr) {
		if (board[r][c] === player) {
			line.push([r, c]);
		} else {
			line.length = 0;
		}
		c++;
		r++;
	}
	return line;
}

function checkIsWinner(player, board) {
	for(var r=0; r<gameData.settings.row; r++){
		for(var c=0; c<gameData.settings.column; c++){
			var count;
			count = countUp(c, r, player, board);
			if (count.length >= gameData.settings.connect) return count;
			count = countRight(c, r, player, board);
			if (count.length >= gameData.settings.connect) return count;
			count = countUpRight(c, r, player, board);
			if (count.length >= gameData.settings.connect) return count;
			count = countDownRight(c, r, player, board);
			if (count.length >= gameData.settings.connect) return count;
		}
	}
	return count;
}

function checkIsTie(board) {
	for(var r=0; r<gameData.settings.row; r++){
		for(var c=0; c<gameData.settings.column; c++){
			if (board[r][c] === -1) {
				return false;
			}
		}
	}
	return true;
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

/*!
 * 
 * UPDATE GAME - This is the function that runs to loop game update
 * 
 */
function updateGame(){
	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = Math.floor((timeData.countdown) - (timeData.elapsedTime));

			if ( typeof initSocket == 'function' && multiplayerSettings.enable && socketData.online) {
				postSocketUpdate('updatetimer', timeData.timer);
			}else{
				updateTimer();
			}
		}
	}
}

function updateTimer(){
	if(timeData.oldTimer == -1){
		timeData.oldTimer = timeData.timer;
	}

	if(timeData.timer <= 0){
		//stop
		showGameStatus('timer');
		endGame();
	}else{
		if((timeData.oldTimer - timeData.timer) > 1000){
			if(timeData.timer < 1000){
				animateTimer()
				playSound('soundCountdownEnd');
			}else if(timeData.timer < 6000){
				animateTimer()
				playSound('soundCountdown');
			}
			timeData.oldTimer = timeData.timer;
		}
		
		timerTxt.text = timerRedTxt.text = millisecondsToTimeGame(timeData.timer);
	}
}


/*!
 * 
 * END GAME - This is the function that runs for game end
 * 
 */
function endGame(){
	gameData.paused = true;

	toggleGameTimer(false);
	TweenMax.to(gameContainer, 2, {overwrite:true, onComplete:function(){
		goPage('result')
	}});
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;  
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleGameMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	title = shareTitle.replace("[SCORE]", playerData.score);
	text = shareMessage.replace("[SCORE]", playerData.score);
	
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}