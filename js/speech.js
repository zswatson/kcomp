(function(exports){
  var kcomp = exports.kcomp = exports.kcomp || {};

  kcomp.speech = function(app) {
    if (!('webkitSpeechRecognition' in window)) {
    tempSpeech.processText(transcript);
      upgrade();
    } else {
      var tempSpeech = {
        app: app,  
        recognition: new webkitSpeechRecognition(),
        start: function() {
          var self = this;
          this.recognition.start();
        },
        stop: function() {
          var self = this;
          this.recognition.stop();
        },
        processText: function(text) {
          var self = this;
          text = text.toLocaleLowerCase();
          if (text.search("add timer") != -1) {
            text = text.replace(/add timer\s*/, "");
            var textMatches = [text.match(/\d+ hours?/g), text.match(/\d+ minutes?/g), text.match(/\d+ seconds?/g)];

            var timeAmounts = textMatches.map(function(d) {
              if (d && d.length == 1) {
                text = text.replace(d, "");
                var split = d[0].split(" ");
                return parseFloat(split[0]);
              }
            });
            
            var mils = (timeAmounts[0] * 36e5) || 0;
            mils += (timeAmounts[1] * 6e4) || 0; 
            mils += (timeAmounts[2] * 1000) || 0;
            self.app.handler.addTimer(mils).label(text || "");
            console.log("remaining text", text);
          }
        }
      }
      
      tempSpeech.recognition.onresult = function(event) {
        var results = event.results;
        if (results.length > 1) {
          console.log("multiple results");
          return;
        }
        var transcript = results[0][0].transcript.toLocaleLowerCase();
        tempSpeech.processText(transcript);
      };
      tempSpeech.recognition.onstart = function() {console.log("recognition starting")};
      tempSpeech.recognition.onend = function() {console.log("recognition end")};
      tempSpeech.recognition.onerror = function(event) {console.log("recognition error:", event)};

      return tempSpeech;
    }
  }


})(this)
