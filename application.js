var turn = 'White'
var rightEdge = [8,16,24,32,40,48,56,64]
var leftEdge  = [1,9,17,25,33,41,49,57]


function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  disableSpots();
  setColor();
  ev.dataTransfer.setData("Text",ev.target.id);
  var spots = calculateSpots(ev.currentTarget);
  console.log(spots);
  enableSpots(spots);
}

function enableSpots(spotArray) {
  spotArray.forEach(function(i) {
    if($('#'+i).children().attr('color') != turn) {
      $('#' + i).attr('ondrop',"drop(event)"); 
      $('#' + i).attr('ondragover', "allowDrop(event)");
      $('#' + i).css('background-color', 'rgb(245, 115, 115)');
    }
  })
}

function setColor() {
  $('.square').css('background-color', 'white');
  $('.row:even .square:odd').css('background-color', 'rgb(27, 180, 162)');
  $('.row:odd .square:even').css('background-color', 'rgb(27, 180, 162)');
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
  capturePiece(ev);
  setColor();
  checkMate();
  switchTurn();
  disableSpots();
}

function checkMate() {
  var currentPlayerPieces = $("[color='" + turn + "']")
  var opponentKing = turn == 'White' ? $('#bking') : $('#king');
  var opponentKingLocation = parseInt($(opponentKing).parent().attr('id'));
  $(currentPlayerPieces).each(function(element) {
    var pieceSpots = calculateSpots(currentPlayerPieces[element])
    if (pieceSpots.indexOf(opponentKingLocation) != -1) {
      return alert("Check");
    }
  })
}

function disableSpots() {
  $('[ondrop]').removeAttr('ondrop');
  $('[ondragover]').removeAttr('ondragover');
}

function capturePiece(ev) {
  var items = ['http://assets.diylol.com/hfs/dfd/2fd/ee4/resized/skeptical-einstein-meme-generator-pics-or-it-didn-t-happen-a9d862.jpg?1316863373.jpg', 'http://i.imgflip.com/1bhk.jpg', 'http://www.troll.me/images/the-most-interesting-man-in-the-world/i-dont-always-play-chess-but-when-i-do-i-lose.jpg', 'http://4.bp.blogspot.com/-F1LjBFqpGSU/UZ_l-qXPPwI/AAAAAAAAAVI/_9xdlp1aF-E/s640/MEME.png','http://www.troll.me/images/bump/pwned.jpg']
  var item = items[Math.floor(Math.random()*items.length)];
  if(ev.toElement.className != 'square') {
    var foo = $(ev.toElement).children().first();
    $(ev.toElement).parent().append(foo);
    ev.toElement.remove();
    if (ev.toElement.className == 'king') {
      alert("GAME OVER");
      $('body').fadeOut(3000);
    }
    $('.funny').html("<div id='turn'>" + turn + "'s Turn</div><img style='display: none;' id='meme' width='600' height='700' src='" + item + "'>");
    $('#meme').fadeIn(500);
    $('#meme').fadeOut(4000);

  }
}

function switchTurn() {
  if(turn == 'White') {
    $('[color=White]').removeAttr('draggable'); 
    $('[color=White]').removeAttr('ondragstart');
    $('[color=Black]').attr('draggable', 'true');
    $('[color=Black]').attr('ondragstart', 'drag(event)');
    turn = 'Black';
  } else {
    $('[color=Black]').removeAttr('draggable'); 
    $('[color=Black]').removeAttr('ondragstart');
    $('[color=White]').attr('draggable', 'true');
    $('[color=White]').attr('ondragstart', 'drag(event)');
    turn = 'White';
  }
  $('#turn').text(turn + "'s Turn");
}

function calculateSpots(piece) {
  var location = parseInt($(piece).parent().attr('id'));
  var type     = $(piece).attr('class');
  var color    = $(piece).attr('color');

  if(type == 'pawn') {
    return pawnSpots(location, color);
  } else if (type == 'rook') {
    return rookSpots(location, color);
  } else if (type == 'knight') {
    return knightSpots(location, color);
  } else if (type == 'bishop') {
    return bishopSpots(location, color);
  } else if (type == 'queen') {
    return queenSpots(location, color);
  } else {
    return kingSpots(location, color);
  }
}

function knightSpots(num, color) {
  var spotsArray = []
  var bottomR = num+17;
  var topL    = num-17;
  var bottomL = num+15;
  var topR    = num-15;
  var downR   = num+10;
  var upL     = num-10;
  var downL   = num+6;
  var upR     = num-6;
  
  if(num == 63) {spotsArray.push(topL, topR, upL);} 
  else if (rightEdge.indexOf(num) != -1) {spotsArray.push(topL, bottomL,upL,downL)}
  else if (leftEdge.indexOf(num) != -1) {spotsArray.push(topR, bottomR,upR,downR)}
  else if ( num == 58) {spotsArray.push(topL, topR, upR);}  
  else if ( num > 58 && num < 63) {spotsArray.push(topL, topR, upR, upL);}
  else if (num == 2) {spotsArray.push(bottomR, bottomL, downR)}
  else if (num == 7) {spotsArray.push(bottomR, bottomL, downL)}
  else if (num > 2 && num < 7) {spotsArray.push(bottomR, bottomL, downL, downR)}
  else {spotsArray.push(topL, topR, upR, upL, bottomL, bottomR, downL, downR)
  }
  return spotsArray;
}

function pawnSpots(num, color) {
  var spotsArray = []
  if (color == 'White') {
    if(num < 57 && num > 48) {
      if($('#'+(num-16)).children().size() != 0) {
        spotsArray.push(num-8);
      } else {
        spotsArray.push(num-8, num-16);
      }
    } else {
      spotsArray.push(num-8);  
    }
    if($('#'+(num-8)).children().size() != 0) {
      var index = spotsArray.indexOf(num-8)
      var index2 = spotsArray.indexOf(num-16)
      spotsArray.splice(index2, 1);
      spotsArray.splice(index, 1);
    }
  } else {
    if(num < 17 && num > 8) {
      if($('#'+(num+16)).children().size() != 0) {
        spotsArray.push(num+8);
      } else {
        spotsArray.push(num+8, num+16);
      }
    } else {
      spotsArray.push(num+8);  
    }
    if($('#'+(num+8)).children().size() != 0) {
      var index3 = spotsArray.indexOf(num+8)
      var index4 = spotsArray.indexOf(num+16)
      spotsArray.splice(index4, 1);
      spotsArray.splice(index3, 1);
    } 
  }
  return addPawnKill(num, color, spotsArray);
}

function rookSpots(num, color) {
  var vert = vertical(num);
  var horz = horizontal(num);
  console.log(vert);
  console.log(horz);
  return vert.concat(horz);
}

function bishopSpots(num, color) {
  return diagonal(num);
}

function queenSpots(num, color) {
  var diags = diagonal(num);
  var vert = vertical(num);
  var horz = horizontal(num);
  return diags.concat(vert, horz);
}

function kingSpots(num, color) {
  var spots = [(num+8), (num-8), (num+1), (num-1), (num+9), (num-9), (num+7), (num-7)]
  if(rightEdge.indexOf(num) != -1) {
    spots.splice(spots.indexOf(num+1), 1);
    spots.splice(spots.indexOf(num-7), 1); 
    spots.splice(spots.indexOf(num+9), 1);
  } else if(leftEdge.indexOf(num) != -1) {
    spots.splice(spots.indexOf(num-1), 1);
    spots.splice(spots.indexOf(num+7), 1); 
    spots.splice(spots.indexOf(num-9), 1);
  }
  return spots;
}

function diagonal(num) {
  var nwSE = [num]
  var neSW = [num]
  var edges = [1,9,17,25,33,41,49,57, 8,16,24,32,40,48,56,64]
  edges.splice(edges.indexOf(num), 1);
  
  if(rightEdge.indexOf(num) == -1) {for(var i = num+9; i < 65; i=i+9) { if(edges.indexOf(i) == -1) {nwSE.push(i)} else {nwSE.push(i); break;} }}
  if(leftEdge.indexOf(num) == -1) {for(var i = num-9; i > 0; i=i-9) { if(edges.indexOf(i) == -1) {nwSE.push(i)} else {nwSE.push(i); break;} }}
  if(leftEdge.indexOf(num) == -1) {for(var i = num+7; i < 65; i=i+7) { if(edges.indexOf(i) == -1) {neSW.push(i)} else {neSW.push(i); break;} }}
  if(rightEdge.indexOf(num) == -1) {for(var i = num-7; i > 0; i=i-7) { if(edges.indexOf(i) == -1) {neSW.push(i)} else {neSW.push(i); break;} }}
  nwSE = nwSE.sort(function(a,b){return a-b});
  neSW = neSW.sort(function(a,b){return a-b});

  scrub1 = findClosest(nwSE, num);
  scrub2 = findClosest(neSW, num);
  return scrub1.concat(scrub2);
}

function vertical(num) {
  var verticalSpots = [num]
  
  for(var i = num; i < 65; i=i+8) { if(i != num) {verticalSpots.push(i)} }
  for(var i = num; i > 0; i=i-8) { if(i != num) {verticalSpots.push(i)} }
  verticalSpots = verticalSpots.sort(function(a,b){return a-b});
  return findClosest(verticalSpots, num);
}

function horizontal(num) {
  var horizontalSpots = []
  var grid = []
  var row = []

  for(var i = 1; i < 65; i++) { 
    row.push(i)
    if(i%8 == 0){grid.push(row); row = []}
  }
  grid.forEach(function(i) {if(i.indexOf(num) != -1) {horizontalSpots = i;}})
  // horizontalSpots.splice(horizontalSpots.indexOf(num), 1);

  return findClosest(horizontalSpots, num);
}

function findClosest(array, num) {
  var scrub = []
  var numIndex = array.indexOf(num);

  for(var i = (numIndex+1); i <= (array.length-1); i++) {
    scrub.push(array[i]);
    if($('#' + array[i]).children().length == 1) break;
  }
  for(var i = (numIndex-1); i >= 0; i--) {
    scrub.push(array[i]);
    if($('#' + array[i]).children().length == 1) break;
  }
  return scrub
}

function addPawnKill(location, color, spotsArray) {
  var whiteL = $('#'+(location-9)).children().first().attr('color') == 'Black'
  var whiteR = $('#'+(location-7)).children().first().attr('color') == 'Black'
  var blackR = $('#'+(location+9)).children().first().attr('color') == 'White'
  var blackL = $('#'+(location+7)).children().first().attr('color') == 'White'
  if(color == 'White') {
    if(whiteL == true && leftEdge.indexOf(location) == -1) {spotsArray.push(location-9)}
    if(whiteR == true && rightEdge.indexOf(location) == -1 ) {spotsArray.push(location-7)}
    return spotsArray;
  } else {
    if(blackR == true) {spotsArray.push(location+9)}
    if(blackL == true) {spotsArray.push(location+7)}
    return spotsArray;
  }
  console.log(spotsArray);
}

$(document).ready( function () {
  setColor();
})