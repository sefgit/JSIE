'use strict'

// Game Level, 0 (easy), 1 (medium), 2 (hard)
var index = 0; 

var gameData = 
[
	// 0: easy
	[{'d':2, 'H':2},{'d':1, 'H':4},{'d':1, 'H':3}],
	// 1: medium
	[{'d':2, 'H':2},{'d':1, 'H':4},{'d':3, 'H':10},{'d':1, 'H':9},{'d':1, 'H':3}],
	// 2: hard
	[{'d':2, 'H':2},{'d':1, 'H':4},{'d':3, 'H':10},{'d':1, 'H':9},{'d':2, 'H':14},{'d':2, 'H':17},{'d':1, 'H':3},{'d':4, 'H':22}]
];

var viewLeaderBoard = 'https://cluelabs.com/stencil/display/widget-table-display?chart=MTI3NnwyNzc3fDdiNWY3ZTlkYjVjN2VkNWZhYTJiNGExZjZhMDllYTFh';
var submitLeaderBoard = 'https://cluelabs.com/stencil/display/widget-table-save-row?chart=MTI3NnwyNzc3fDdiNWY3ZTlkYjVjN2VkNWZhYTJiNGExZjZhMDllYTFh';
//var viewLeaderBoard = 'https://cluelabs.com/stencil/display/widget-table-display?chart=MTIxMXwyNjAxfGNmMzE0ZTM4OGI2NzNhNzZmNDQzOTQ2ZTg0OTkxZDVk';
//var submitLeaderBoard = 'https://cluelabs.com/stencil/display/widget-table-save-row?chart=MTIxMXwyNjAxfGNmMzE0ZTM4OGI2NzNhNzZmNDQzOTQ2ZTg0OTkxZDVk';

/* global variables 
 * do not edit after this line
 * ============================
 */
var nama, kelas, sekolah;
var avatar;
var level;
var steps;
var curStep;
var curTasks;
var curTask;
var curTstamp;
var curLevel;
var curBonus='';
var totalScores = 0;
var timerBonus=0;
var elTicks;
var target = 0;
var pos = 0;
var lastX = 0;
var ticksPerDay = 0;
var xOffset = 0;
var _confirming = false;
var _late = false;
var timerID = 0;
var games = [];
var items = [];
var elmItems = [];

var idScoring = 0;
var idMonitor = 0;
var idWorkFx = 0;
var fx;
var fx2;
var bgMusic;
var bgMusic2;

function toggleFullScreen() {
    // Check for browser support of service worker
    if (window.matchMedia('(display-mode: fullscreen)').matches == true)
        return;

    if(navigator.standalone == true)
        return;

    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
}

function _playAgain()
{
	fx.pause();
	fx.stop();
	fx2.pause();
	fx2.stop();
	bgMusic.stop();
	bgMusic2.stop();
	if (idMonitor > 0)
		clearInterval(idMonitor);
	idMonitor = 0;
	index = 0;
	totalScores = 0;
	startGame();
}

function _play(ev)
{
	toggleFullScreen();
	totalScores = 0;
	var el = document.getElementById('btn1');
	el.removeEventListener('click', _play);
	el.removeEventListener('touchend', _play);
	el = document.getElementById('btn2');
	el.removeEventListener('click', _play);
	el.removeEventListener('touchend', _play);
	el.style.zIndex = 100;
	el = ev.target;
	var theme = Number(el.getAttribute('data-theme'));
	el = document.getElementById('start');
	el.style.display = 'none';
	el = document.getElementById('welcome_text');
	el.innerHTML = '<br>';
	el = document.getElementById('clickme');
	el.style.display = 'block';
	var himnes = ['../fx/himne2.mp3', '../fx/himne.mp3']
	var bgs = ['../fx/bg2.mp3', '../fx/bg.mp3']
    bgMusic = new Howl({
        src: [himnes[theme]],
        html5: true,
        buffer:true,
        autoplay:false,
        preload:true,
        loop:true,
        onload: function() {
			el = document.getElementById('voldiv');
			el.style.display = 'block';
			Howler.volume(0.6);
			bgMusic.play();
			bgMusic2 = new Howl({
				src: [bgs[theme]],
				html5: true,
				buffer:true,
				autoplay:false,
				preload:true,
				loop:true,
				onload: function() {
					fx = new Howl({
						src: ['../fx/iesim.mp3'],
						sprite: {
							click: [0, 377, false],
							fail: [842, 669, false],
							buzz: [1947, 2986, false],
							ding: [5207, 2108, false],
							work: [7604, 17100, true],
							credits: [24842, 16538, true]
						  },        
						html5: true,
						buffer:true,
						autoplay:false,
						preload:true,
						loop:false,
						onload: function() {
							fx2 = new Howl({
								src: ['../fx/voices.mp3'],
								sprite: {
									confirm: [0, 4604, false],
									sort: [4872, 3200, false],
									hurry: [8774, 1360, false],
									timeout: [10980, 1382, false]
								  },        
								html5: true,
								buffer:true,
								autoplay:false,
								preload:true,
								loop:false,
								onload: function() {
									var el = document.getElementById('submit');
									el.addEventListener('click', play);
									el.addEventListener('touchend', play);			
								}
							});								
						}
					});					
				}
			});
        }
    });
}

function play(ev) 
{
	avatar.style.display = 'none';
	var el = document.getElementById('nama');
	nama = el.value.trim();
	el = document.getElementById('kelas');
	kelas = el.value.trim();
	el = document.getElementById('sekolah');
	sekolah = el.value.trim();
	if ((nama == "") || (kelas == ""))
	{
		fx.play('fail');
		return;
	}
	el = document.getElementById('submit');
	el.style.display='none';
	el = document.getElementById('player');
	var s = '<b>' + nama + '</b>';
	if (kelas != "")
		s += " (" + kelas + ")";
	if (sekolah != "")
		s += "<br><small>" + sekolah + "</small>";
	el.innerHTML = s;
	if (ev && ev.shiftKey) 
	{
		el = document.getElementById('jsp');
		el.style.display = 'block';
		el = document.getElementById('bg');
		el.style.zIndex = -1;
		anime({
		  targets: '#ti',
		  translateY: 40,
		  direction: 'alternate',
		  loop: true,
		  easing: 'spring(1, 80, 10, 0)'
		});	  	
		startGame();
		return;
	}
	el = document.getElementById('bg');
	el.className = "bg1";
	anime({
	  targets: '#bg',
	  opacity: 1.0,
	  duration: 1000,
	  direction: 'normal',
	  loop: false,
	  easing: 'linear',
	  complete: function(anim) {
			var el = document.getElementById('welcome');
			el.style.display='none';
			el = document.getElementById('human');
			el.style.display='none';
			anime({
			  targets: '#fast',
			  translateX: -400,
			  duration: 2000,
			  direction: 'normal',
			  loop: false,
			  easing: 'linear',
				complete: function(anim) {
					anime({
					  targets: '#ti',
					  translateY: 40,
					  direction: 'alternate',
					  loop: true,
					  easing: 'spring(1, 80, 10, 0)'
					});	  
					showIntro();					
				}
			});  
	  }
	});  
}

function initGame()
{
	var s;
	games = [];
	var tasks;
	var x = "A".charCodeAt(0);
	for(var x in gameData) 
	{
		var col = gameData[x];
		tasks = [];
		for(var y in col)
		{
			var g = col[y];
			s = '<i>' + String.fromCharCode(65+Number(y)) + "</i> (";
			s += g.d + 'd) H+' + g.H;		
			tasks.push({'label':s, 'idx':y});
		}
		games.push(tasks);
	}
	var game = games[index];
	s = '';
	for(var x in game) 
	{
		if (game[x].label == "")
			break;
		s += '<div class="item draggable cat drag" data-idx='+game[x].idx+'>'+game[x].label+'</div>';
	}
	var el = document.getElementById('items');
	el.innerHTML = s;
	var  els = document.getElementsByClassName('item');
	elmItems = Array.prototype.slice.call(els);
	var rect = elmItems[0].getBoundingClientRect();
	var itemHeight = rect.height;
	var itemsTop = elmItems.map(function(v, i) {
		return Math.round(rect.top + window.pageYOffset + itemHeight * i);
	});

	function sort(targetItem, top) 
	{
		var curIndex = items.indexOf(targetItem);
		var newIndex = itemsTop.indexOf(Math.round(top));
		
		if (newIndex !== -1 && newIndex !== curIndex) 
		{
		  items.splice(newIndex, 0, items.splice(curIndex, 1)[0]);
		  items.forEach(function(item, i) {
			if (item !== targetItem) 
				item.top = itemsTop[i]; 
		  });
		}
	}

	items = elmItems.map(function(elmItem) {
		return new PlainDraggable(elmItem, {
			snap: {
				y: {step: itemHeight},
				side: 'start'
			},
			onDrag: function(moveTo) {
				if (!moveTo.snapped) { return false; }
				sort(this, moveTo.top);
				if (_confirming)
					resetBtnPlay();
				return true;
			}
		});
	});	
}

function startGame()
{
	fx.play('click');
	var el = document.getElementById('btnStart');
	el.style.display='none';
	el = document.getElementById('ti');
	el.style.display='block';
	el = document.getElementById('jsp');
	el.style.display='block';
	el = document.getElementById('welcome');
	el.style.display='none';
	el = document.getElementById('content');
	el.style.display='none';
	el = document.getElementById('rules');
	el.style.display='none';
	el = document.getElementById('bg');
	el.className = "bg3";
	el.style.opacity=0.5;
	el = document.getElementById('items');
	el.innerHTML = '';
	el = document.getElementById('lanes');
	el.innerHTML='';
	el.style.display='none';
	el = document.getElementById('point');
	el.innerHTML='';	
	el = document.getElementById('lane');
	el.style.display='inline-block';
	el = document.getElementById('btnPlay');
	el.style.visibility = 'hidden';				  
	resetBtnPlay();
	el = document.getElementById('message');
	el.style.display='none';
	//showCredits();
	//return;
	el = document.getElementById('stage');
	el.style.display='inline-block';
	el = document.getElementById('message');
	el.style.display='inline-block';
	el = document.getElementById('player');
	el.style.display = 'block';				  
	anime({
	  targets: '#fast',
	  translateX: -160,
	  duration: 1000,
	  direction: 'normal',
	  loop: false,
	  easing: 'linear',
	  complete: function(anim) {
		avatar.src = '../res/head.png';
		avatar.style.display = 'block';
		avatar.style.zIndex = -1;
		el = document.getElementById('human');
		el.className = 'human2';
		el.style.display='block';
		el = document.getElementById('logo');
		el.style.display='block';
		el.style.opacity=0.5;
		anime({
		  targets: '#fast',
		  translateY: -540,
		  duration: 1000,
		  direction: 'normal',
		  loop: false,
		  easing: 'linear',
		  complete: function(anim) {
			el = document.getElementById('fast');
			el.style.opacity=0.8;
			el = document.getElementById('tools');
			el.innerHTML = '<div class="bonus" id="eq" title="kecerian">E Q</div><div class="bonus" id="fq" title="kebugaran">F Q</div><div class="bonus" id="iq" title="kecerdasan">I Q</div>';
			el.style.display='block';
			fx2.play('sort');
			initGame();
			anime({
			  targets: '#tools',
			  translateX: -200,
			  duration: 1000,
			  direction: 'normal',
			  loop: false,
			  easing: 'linear',
			  complete: function(anim) {
				el = document.getElementById('btnPlay');
				el.style.visibility = 'visible';				  
			  }
			});
		  }
		});
	  }
	 });
}

function showRules()
{
	fx.play('click');
	var el = document.getElementById('btnRules');
	el.style.display='none';
	el = document.getElementById('content');
	el.style.display='none';
	el = document.getElementById('rules');
	el.style.display='block';
	el = document.getElementById('btnStart');
	el.addEventListener('touchend', startGame);
	el.addEventListener('click', startGame);
}

function showIntro()
{
	var el = document.getElementById('inwork');
	el.style.display='block';
	el = document.getElementById('human');
	el.style.display='none';
	el = document.getElementById('bg');
	el.style.opacity=0.5;
	anime({
	  targets: '#fast',
	  translateY: -540,
	  duration: 2000,
	  direction: 'normal',
	  loop: false,
	  easing: 'linear',
		complete: function(anim) {
			var el = document.getElementById('bg');
			el.className = "bg3";
			anime({
			  targets: '#fast',
			  translateX: -160,
			  duration: 1000,
			  direction: 'normal',
			  loop: false,
			  easing: 'linear',
				complete: function(anim) {
					fx.play('click');
					var el = document.getElementById('fast');
					el.style.opacity=0.2;
					el = document.getElementById('content');
					el.style.display='block';
					el.style.opacity=1;
					el = document.getElementById('btnRules');
					el.addEventListener('touchend', showRules);
					el.addEventListener('click', showRules);
				}
			});  	


		}
	});  	
}

function showCredits()
{
	if (idMonitor > 0)
		clearInterval(idMonitor);
	bgMusic.stop();
	bgMusic2.fade(0.5,0,1000);
	fx.play('credits');
	idMonitor = 0;	
	var el = document.getElementById('player');
	el.style.display = 'none';				  
	el = document.getElementById('point');
	el.style.display = 'none';				  
	el = document.getElementById('lanes');
	var s = '<h2>Credits</h2><hr>';
	s += '<div id="credits"><div id="scrolltext">';
	s += '<h3>Dean and Faculty</h3>';
	s += '<a href="https://uph.edu/id/department/industrial-engineering/#pengajar"><small>https://uph.edu/id/department/industrial-engineering/#pengajar</small></a>';
	s += '<h3>HMPSTI</h3>';
	s += '<a href="https://linktr.ee/hmpsti.uph"><small>https://linktr.ee/hmpsti.uph</small></a>';

	s += '<h3>Music</h3>';
	s += 'Hymne UPH by aris hadi <br><a href="https://youtube.com/watch?v=8Bj3z_XKLf8"><small>https://youtube.com/watch?v=8Bj3z_XKLf8</small></a>';
	s += '<br><small><br></small>Mentee song with lyric';
	s += '<br><a href="https://youtube.com/watch?v=rYuToD6CKo4"><small>https://youtube.com/watch?v=rYuToD6CKo4</small></a>';
	s += '<h3>Sounds & Voices</h3>';
	s += 'Free Sound<br><a href="https://freesound.org/"><small>https://freesound.org/</small></a>';
	s += '<br><small><br></small>FreeTTS<br><a href="https://freetts.com/"><small>https://freetts.com/</small></a>';
	s += '<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;';
	s += '<h4>Developed by</h4><small>Effendi Soewono</small>';
	s += '<br>&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;';
	s += '</div></div><hr>&copy; 2021 Industrial Engineering<br>UPH Karawaci';
	el.innerHTML = s;	
}

function move(e)
{
	e.preventDefault();
	var x = (e.clientX || e.screenX);
	if (curBonus == '')
	{
		if (lastX > 0)
		{
			var xdiff = Math.abs(lastX - x);
			curLevel += xdiff / 100;
			if (curLevel > 100)
				curLevel = 100;
		}				
	}
	lastX = x;
}

function randomBonus()
{
	anime({
		targets: '.bonus',
		translateX: function() {
		  return anime.random(-200, 200);
		},
		easing: 'easeInOutQuad',
		duration: 600,
		complete: randomBonus
	});	
}

function resetBtnPlay()
{
	var el = document.getElementById('btnPlay');
	if (el)
	{
		el.removeEventListener('touchend', simulate);
		el.removeEventListener('click', simulate);		
		el.addEventListener('touchend', confirmPlay);
		el.addEventListener('click', confirmPlay);
		el.innerHTML = "PLAY";
	}
	_confirming = false;
}

function confirmPlay()
{
	_confirming = true;
	var el = document.getElementById('btnPlay');
	el.removeEventListener('touchend', confirmPlay);
	el.removeEventListener('click', confirmPlay);
	el.addEventListener('touchend', simulate);
	el.addEventListener('click', simulate);
	el.innerHTML = "PLAY NOW";
	fx2.play('confirm');
}

function applyBonus(ev)
{
	if (curBonus != '')
	{
		fx.play('fail');
		return;
	}
	var el = ev.target;	
	if (el.id == 'eq')
	{
		if (curLevel < 60)
		{
			fx.play('fail');
			return;			
		}
		curBonus = 'eq';
		curLevel = 50;
		timerBonus = ticksPerDay;
		el.style.visibility ='hidden';
		fx.play('ding');
	}
	else if (el.id == 'fq')
	{
		if (curLevel > 40)
		{
			fx.play('fail');
			return;			
		}		
		curBonus = 'fq';
		curLevel = 50;
		timerBonus = ticksPerDay;
		el.style.visibility ='hidden';
		fx.play('ding');
	}
	else if (el.id == 'iq')
	{
		if ((curLevel < 40) || (curLevel > 60))
		{
			fx.play('fail');
			return;			
		}				
		curBonus = 'iq';
		curLevel = 50;
		timerBonus = ticksPerDay;
		el.style.visibility ='hidden';
		fx.play('ding');
	}
	if (curBonus != '')
	{
		level.style.backgroundColor = 'magenta';
		anime({
		  targets: '#level',
		  scale: 2,
		  duration: 1000,
		  direction: 'normal',
		  loop: true,
		  easing: 'linear'
		});
		
		if (idWorkFx > 0)
			fx.rate(1.5, idWorkFx);		
	}
}

function simulate()
{
	fx2.pause();
	fx2.stop();
	bgMusic.fade(1.0,0,2000);
	bgMusic2.play();
	curStep = 0;
	curTstamp = 0;
	lastX = 0;
	pos = 0;
	curLevel = 0;
	avatar.style.zIndex = 1;
	avatar.style.display = 'block';
	var el = document.getElementById('message');
	el.style.display='none';
	el = document.getElementById('btnPlay');
	el.removeEventListener('touchend', simulate);
	el.removeEventListener('click', simulate);
	var taskId;
	var _max = 0;
	curTasks = gameData[index];
	for(var x in curTasks)
	{
		var task = curTasks[x];
		var days = task.d + task.H;
		task.work = 0;
		task.totalWork = 0;
		task.startTstamp = 0;
		task.stopTstamp = 0;
		task.plannedTstamp = 0;
		if (days > _max)
			_max = days;
	}
	target = Math.ceil(_max/10) * 5;
	ticksPerDay = Math.ceil(300 / target);
	var game = games[index];  
	steps = game.length;
	var w = (ticksPerDay*2) + "px";	
	var s = '<table id="tmain" class="main"><tr><th class="task" rowspan=2>TUGAS</th>';
	for(var n=0; n<target; n++)
	{
		s += '<th><img src="../res/space.png" width="'+w+'" height="1" border=0><br>H+'+(2*(n+1));
		s += '</th>';
	}
	s += '<th rowspan=2 width="100%">+ poin</th></tr>';
	s += '<tr><th id="ticks" colspan='+target+' style="line-height:2px">&nbsp;</th></tr>';

	for(var x in items) 
	{
		s += '<tr id="task'+x+'" class="on"><td rowspan=4 id="t'+x+'" class="task">&nbsp;&nbsp;'+items[x].element.innerHTML+'</td>';
		for(var n=0; n < target; n++)
		{
			s += '<td>&nbsp;</td>';
		}
		s += '<td rowspan=4 id="d'+x+'" class="score">&nbsp;</td></tr>';
		s += '<tr><td id="ref'+x+'" colspan='+target+' class="ron">&nbsp;</td></tr>';		
		s += '<tr><td id="plan'+x+'" colspan='+target+' class="pon">&nbsp;</td></tr>';		
		s += '<tr><td id="real'+x+'" colspan='+target+' class="ton">&nbsp;</td></tr>';
	}
	s+= '<tr><td colspan='+(target+2)+'><div id="panel">POWER&nbsp;<div id="power"><div id="level"></div></div>&nbsp;STRESS</td></tr></table>';
	
	el = document.getElementById('stage');
	el.style.display = 'none';
	el = document.getElementById('lanes');
	el.innerHTML = s;
	el.style.display = 'inline-block';
	if (timerID) 
		clearInterval();
	var p = 0;
	for(var x in curTasks)
	{
		var taskId = items[x].element.dataset.idx;
		var task = curTasks[taskId];
		task.totalWork = task.d * ticksPerDay;
		var wx = task.totalWork + 'px 100%';
		var id = 'ref'+x;
		el = document.getElementById(id);
		var id2 = 'plan'+x;
		var el2 = document.getElementById(id2);
		task.plannedTstamp = p;
		var px = p + 'px 0';
		el.style.backgroundPosition = px;
		el.style.backgroundSize = wx;
		el2.style.backgroundPosition = px;
		el2.style.backgroundSize = wx;
		p += task.totalWork;
	}
		
	level = document.getElementById('level');
	level.style.display = 'block';
	level.style.marginLeft = pos + "%";
	
	taskId = items[curStep].element.dataset.idx;
	curTask = curTasks[taskId];
	curTask.startTstamp = 0;

	elTicks = document.getElementById('ticks');	
	var elMain = document.getElementById('tmain');
	var rcMain = elMain.getBoundingClientRect();
	var rcTicks = elTicks.getBoundingClientRect();
	xOffset = Math.floor(rcTicks.x - rcMain.x - 1);

	var w = xOffset + 'px 0';
	var id = 'task'+curStep;
	el = document.getElementById(id);
	el.style.backgroundPosition = w;
	
	var els = document.getElementsByClassName('bonus');
	for(var x=0; x < els.length; x++)
	{
		el = els[x];
		el.style.visibility = 'visible';		
		el.addEventListener('click', applyBonus);
		el.addEventListener('touchend', applyBonus);
	}
	el = document.getElementById('lane');
	el.addEventListener('mousemove', move);
	el.addEventListener('touchmove', move);
	timerID = setInterval(gameLoop, 10);
	randomBonus();
	idWorkFx = fx.play('work');
}

function nextLevel()
{
	fx2.pause();
	fx2.stop();
	bgMusic.stop();
	bgMusic2.stop();
	avatar.src = '../res/head.png';
	index += 1;
	if (index > 2)
	   index = 0;
	var el = document.getElementById('lanes');
	el.innerHTML = '';
	el.style.display = 'none';	
	startGame();
}

function loadHighScore()
{
	var d = new Date();
	var query = '&t=' + d.getTime();
	var el = document.getElementById('board');
	if (el)
		el.src = viewLeaderBoard+query;
}
function submitScore()
{
	avatar.src = '../res/head.png';
	var	xhr = new XMLHttpRequest();
	xhr.onload = function(data) {
		var el = document.getElementById('lanes');
		if (xhr.status != 200) {
			el.innerHTML = xhr.statusText;
		} else { // show the result
			var d = new Date();
			var query = viewLeaderBoard + '&t=' + d.getTime();
			var el = document.getElementById('lanes');
			var s = 'TOP 10<br><br><iframe id="board" src="'+query+'"></iframe><br><br>';
			s += '<button onclick="_playAgain();">PLAY AGAIN</button>&nbsp;';
			s += '<button onclick="showCredits();">DONE</button>';
			el.innerHTML = s;
			idMonitor = setInterval(loadHighScore, 5000);
		}		
	};
	var d = new Date();
	var ds = d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
	var id = ds + ' ' + nama + ' ( ' + kelas + (sekolah==""?"":' - ' + sekolah) + ' )';
	var query = submitLeaderBoard;
	query += '&newnum=' + encodeURIComponent(totalScores);
	query += '&newtext=' + encodeURIComponent(id);
	var d = new Date();
	query += '&t=' + d.getTime();
	xhr.open('GET', query);
	xhr.send();
}

function showScores()
{
	var el;
	if (curStep < steps)
	{
		var score = -100;
		var taskId = items[curStep].element.dataset.idx;
		var task = curTasks[taskId];
		if (task.work >= task.totalWork)
		{
			// task completed (d days)
			score = Math.round((Math.round((task.stopTstamp - task.startTstamp)/10)*10) / task.totalWork) * 100;
			// 
			// task on schedule (H + days)
			var delta = Math.round(task.H * ticksPerDay) - task.stopTstamp;
			if (delta < 0)
				delta = delta * 10;
			score += Math.round(delta);				
		}
		totalScores += score;
		el = document.getElementById('d' + curStep);
		el.innerHTML = score;
		fx.play('click');
		curStep += 1;		
	}
	else
	{
		var els = document.getElementsByClassName('bonus');
		var found = false;
		for(var x=0; x < els.length; x++)
		{
			el = els[x];
			if (el.style.visibility != 'hidden')
			{
				found = true;
				el.style.visibility = 'hidden';
				totalScores += 50; // each bonus 50 points
				fx.play('click');
				break;
			}
		}
		if (!found)
		{
			// DONE
			clearInterval(idScoring);
			var msg;
			if (totalScores < 0)
			{
				msg = 'You can do better !';
				if (avatar.src != '../res/1.png')
					avatar.src = '../res/1.png';				
			}
			else
			{
				msg = 'WELL DONE !';				
				if (avatar.src != '../res/3.png')
					avatar.src = '../res/3.png';
			}
			if (index < 2)
			{
				msg += " Let's try next level.";
				msg += '<div id="nextlevel" class="next right" onclick="nextLevel()" title="next level">';
			}
			el = document.getElementById('panel');
			el.className = 'done';
			el.innerHTML = msg;
			fx.play('ding');
			el = document.getElementById('tools');
			el.style.display = 'none';			
			if (index >= 2)
			{
				setTimeout(submitScore, 2000);				
			}
		}
	}
	el = document.getElementById('point');
	el.innerHTML = totalScores;
}

function gameDone()
{
	var el;
	clearInterval(timerID);
	avatar.src = '../res/head.png';
	timerID = 0;
	curStep = 0;
	fx.pause();
	fx.stop();
	idWorkFx = 0;
	fx.play('buzz');
	anime.remove('.bonus');
	var els = document.getElementsByClassName('bonus');
	for(var x=0; x < els.length; x++)
	{
		el = els[x];		
		el.style.transform = 'none';
		el.removeEventListener('click', applyBonus);
		el.removeEventListener('touchend', applyBonus);
	}
	level.style.display = 'none';
	el = document.getElementById('point');
	el.style.display = 'block';
	el = document.getElementById('panel');
	el.className = 'done';
	el.innerHTML = 'scoring ...';
	idScoring = setInterval(showScores, 1000);
}

function getWork(level, limit)
{
	var val = 0;
	if (curLevel > 90)
		val = 0.01
	else if (curLevel > 60)
		val = 0.02
	else if (curLevel > 40)
		val = 0.05 * (curLevel / 30);
	else if (curLevel > 10)
		val = 0.02
	if (val > limit)
		return limit;
	return val;
}

function gameLoop()
{
	var id, el, taskId;
	curTstamp += 0.05;
	if (timerBonus > 0)
		timerBonus -= 0.05;
	if (pos < 600)	
	{
		pos += 0.05;
		var s = pos + 'px 100%';
		elTicks.style.backgroundSize = s;
	}
	else
	{
		elTicks.style.backgroundSize = '100% 100%';
		curTask.stopTstamp = curTstamp;
		gameDone();
		fx2.play('timeout');
		return;
	}
	
	// update TASKS
	if (curStep < steps)
	{
		curTask.work += getWork(curLevel, curTask.totalWork);
		var w = Math.round(curTask.work) + 'px 100%';
		id = 'task'+curStep;
		el = document.getElementById(id);
		el.style.backgroundSize = w;
		if (curTstamp > (curTask.startTstamp + curTask.totalWork))
		{
			if (!_late)
			{
				_late = true;
				fx2.play('hurry');
			}
		}
		if (curStep < steps)
		{
			taskId = items[curStep].element.dataset.idx;
			curTask = curTasks[taskId];				
			
			var wx = (curTstamp - curTask.startTstamp) + 'px 100%';
			var id = 'real'+curStep;
			el = document.getElementById(id);
			var px = curTask.startTstamp + 'px 0';
			el.style.backgroundPosition = px;
			el.style.backgroundSize = wx;
			if (curTask.work >= curTask.totalWork)
			{			
				curTask.stopTstamp = curTstamp;
				var diff = curTstamp - (curTask.startTstamp + curTask.totalWork);
				curStep += 1;
				if (curStep < steps)
				{
					_late = false;
					taskId = items[curStep].element.dataset.idx;
					curTask = curTasks[taskId];				
					curTask.startTstamp = curTstamp;
					id = 'task'+curStep;
					w = (xOffset + curTstamp) + 'px 0';
					el = document.getElementById(id);
					el.style.backgroundPosition = w;
					// update planned schedule
					for(var z = curStep; z < steps; z++) 
					{
						var tId = items[z].element.dataset.idx;
						var task = curTasks[tId];				
						task.plannedTstamp += diff;
						var pz = task.plannedTstamp + 'px 0';
						var idz = 'ref'+z;
						var elz = document.getElementById(idz);
						elz.style.backgroundPosition = pz;
					}
				}
				else
				{
					gameDone();
					return;
				}
			}
		}
	}
	
	
	// update POWER / STRESS LEVEL	
	level.style.marginLeft = curLevel + "%";
	if (timerBonus > 0)
	{
		if (avatar.src != '../res/6.png')
			avatar.src = '../res/6.png';
		return;				
	}
	curBonus = '';
	anime.remove('#level');
	level.style.transform = 'none';
	var decay = 4;
	if (curLevel < 10)
	{
		if (avatar.src != '../res/5.png')
			avatar.src = '../res/5.png';
		level.style.backgroundColor = '#910404';
		if (idWorkFx > 0)
			fx.rate(0.5, idWorkFx);
	}
	else if (curLevel < 20)
	{
		if (avatar.src != '../res/5.png')
			avatar.src = '../res/5.png';
		level.style.backgroundColor = '#e4c02e';
		if (idWorkFx > 0)
			fx.rate(0.6, idWorkFx);
	}
	else if (curLevel < 40)
	{
		if (avatar.src != '../res/1.png')
			avatar.src = '../res/1.png';
		level.style.backgroundColor = '#d4e313';
		decay = 6;
		if (idWorkFx > 0)
			fx.rate(0.8, idWorkFx);
	}
	else if (curLevel > 90)
	{
		if (avatar.src != '../res/2.png')
			avatar.src = '../res/2.png';
		level.style.backgroundColor = '910404';
		decay = 30;
		if (idWorkFx > 0)
			fx.rate(0.5, idWorkFx);
	}
	else if (curLevel > 80)
	{
		if (avatar.src != '../res/0.png')
			avatar.src = '../res/0.png';
		level.style.backgroundColor = '#e4c02e';
		decay = 25;
		if (idWorkFx > 0)
			fx.rate(0.6, idWorkFx);
	}
	else if (curLevel > 60)
	{
		if (avatar.src != '../res/4.png')
			avatar.src = '../res/4.png';
		level.style.backgroundColor = '#d4e313';
		decay = 20;		
		if (idWorkFx > 0)
			fx.rate(0.8, idWorkFx);
	}
	else
	{
		if (avatar.src != '../res/3.png')
			avatar.src = '../res/3.png';
		level.style.backgroundColor = 'lime';
		decay = 10;		
		if (idWorkFx > 0)
			fx.rate(1.0, idWorkFx);
	}
	if (curLevel > 0)
		curLevel -= Math.random() / decay;
}

// start here
window.addEventListener('load', function() {
	var el = document.getElementById('bg');
	el.style.zIndex = -1;
	el = document.getElementById('btn1');
	el.addEventListener('click', _play);
	el.addEventListener('touchend', _play);
	el = document.getElementById('btn2');
	el.addEventListener('click', _play);
	el.addEventListener('touchend', _play);
	el = document.getElementById('vol');
	el.addEventListener('change', function(e) {
		Howler.volume(this.value/100);
	});	
	avatar = document.getElementById('avatar');
	/*
	avatar.style.display = 'block';
	anime({
	  targets: '#avatar',
	  scale: [0.4, 1.0],
	  duration: 1000,
	  direction: 'alternate',
	  loop: true,
	  easing: 'spring(1, 80, 10, 0)'
	});
	*/
});
/*
window.addEventListener('keypress', function(e) {
		fx.pause();
		fx.stop();
		idWorkFx = 0;
		if (e.code == 'Digit1')
			fx.play('click');
		else if (e.code == 'Digit2')
			fx.play('fail');
		else if (e.code == 'Digit3')
			fx.play('buzz');
		else if (e.code == 'Digit4')
			fx.play('ding');
		else if (e.code == 'Digit5')
			idWorkFx = fx.play('work');			
		else if (e.code == 'Digit9')
			fx2.play('confirm');
		else if (e.code == 'Digit8')
			fx2.play('hurry');
		else if (e.code == 'Digit7')
			fx2.play('sort');
		else if (e.code == 'Digit6')
			fx2.play('timeout');
});
*/
// EQ: emotion quotient
// FQ: fitness quotient
// IQ: intelligence quotient

// https://www.youtube.com/watch?v=UGvc-qujB-o 
// https://cssgradient.io/
// https://html-css-js.com/css/generator/font/
// https://freetts.com/
// https://anseki.github.io/plain-draggable/
// https://howlerjs.com/
//
// https://freesound.org/
// Leaderboard: (Articulate Storyline)
// https://cluelabs.com/
// file:///E:/sef/Docs/GAMES/iesim/index.html
//
// https://www.youtube.com/watch?v=8Bj3z_XKLf8
// Hymne Universitas Pelita Harapan (UPH) Piano Instrumental (do: f) oleh aris hadi
//
//
// https://www.youtube.com/watch?v=rYuToD6CKo4
// Mentee song with lyric
