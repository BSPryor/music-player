var createSongRow = function (songNumber, songName, songLength) {
  var template =
     '<tr class="album-view-song-item">'
   + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
   + '  <td class="song-item-title">' + songName + '</td>'
   + '  <td class="song-item-duration">' + songLength + '</td>'
   + '</tr>'
   ;

  var handleSongClick = function() {
    var clickedSongNumber = $(this).attr('data-song-number');

    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');

      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }
  
    if (clickedSongNumber !== currentlyPlayingSongNumber) {
      currentlyPlayingSongNumber = clickedSongNumber;

      setSong(songNumber);

      currentSoundFile.play();

      $(this).html(pauseButtonTemplate);
  
    } else {
      if (currentSoundFile.isPaused()) {
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
      } else {
        currentSoundFile.pause();
        $(this).html(playButtonTemplate);
      }
    }
  };

  var onHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');
  
    if (songNumber !== currentlyPlayingSongNumber) {
      songItem.html(playButtonTemplate);
    }
  };
  
  var offHover = function () {
    var songItem = $(this).find('.song-item-number');
    var songNumber = songItem.attr('data-song-number');
  
    if (songNumber !== currentlyPlayingSongNumber){
      songItem.html(songNumber);
    }
  };

  var $row = $(template);

  $row.find('.song-item-number').click(handleSongClick);
  $row.hover(onHover, offHover);

  return $row;
};


var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $songRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($songRow);
  }
};

var setSong = function (songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  var songUrl = currentAlbum.songs[currentlyPlayingSongNumber - 1].audioUrl;

  var currentlyPlayingSongName = currentAlbum.songs[currentlyPlayingSongNumber - 1].title;
  var currentlyPlayingArtist = currentAlbum.artist; 
  
  $('.song-name').html(currentlyPlayingSongName);
  $('.artist-name').html(currentlyPlayingArtist);
  
  currentSoundFile = new buzz.sound(songUrl, {
    formats: [ 'mp3' ],
    preload: true,
  });
};

$('.ion-play').on('click', function () {
  if(currentSoundFile === null) {
    currentlyPlayingSongNumber = 1;
    setSong(1); 
    currentSoundFile.play();
  } else if(currentSoundFile.isPaused()) {
    currentSoundFile.play();
  } else {
    currentSoundFile.pause();
  }
})



var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSongNumber = null;
var currentSoundFile = null;
var currentAlbum = null;

setCurrentAlbum(albums[0]);