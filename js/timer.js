(function(exports) {
  var kcomp = exports.kcomp = exports.kcomp || {};
  
  kcomp.timerHandler = function(selector) {
    var tempHandler = {
      selector: selector,
      start: new Date().getTime(),
      time: 0,
      interval: 100,
      timers: {},
      latestTimerId: 0,
      addTimer: function(duration, startPaused){
        var self = this;
        var timer = kcomp.timer(self, self.selector, duration, startPaused);
        return timer;
      }
    }

    tick = tempHandler.tick = function() {
      tempHandler.time += tempHandler.interval;
      var diff = (new Date().getTime() - tempHandler.start) - tempHandler.time;
      window.setTimeout(tick, (tempHandler.interval - diff));
      for (id in tempHandler.timers) {
        var timer = tempHandler.timers[id];
        timer.tick(tempHandler.interval);
      }

    }

    window.setTimeout(tick, tempHandler.interval);
    return tempHandler;
  }


  kcomp.timer = function(handler, selector, duration, startPaused) {
    var tempTimer = {
      container: d3.select(selector),
      id: handler.latestTimerId++,
      label: "",
      running: startPaused ? false : true,
      duration: duration,
      elapsed: 0,
      remaining: duration,
      getDisplayText: function() {
        var timeFormat = d3.format("02d");
        var self = this;

        var totalSeconds = Math.abs(Math.ceil(self.remaining / 1000));

        var hours = timeFormat(Math.floor(totalSeconds / 3600)),
            mins = timeFormat(Math.floor((totalSeconds % 3600) / 60)),
            secs = timeFormat(totalSeconds % 6e4);
        return [hours, mins, secs].join(":");
      },
      tick: function(interval){
        var self = this;
        if (self.running) {
          self.elapsed += interval;
          self.remaining = self.duration - self.elapsed;
          self.display.select(".timer-time").text(self.getDisplayText());

          if (self.elapsed >= self.duration) {
            if (!(self.display.classed("finished"))) {
              self.display.classed("finished", true);
              self.display.select(".alarm")[0][0].play();
              console.log(self.label + " finished!");
            }
            self.display.classed("blink", Math.floor(self.elapsed / 1000) % 2);

          };
        };
      },
      label: function(text) {
        var self = this;
        if (text == null) return self.label;
        self.label = text;
        self.display.select(".timer-label").text(text);
        return self;
      },
      play: function() {
        var self = this;
        this.running = true;
      },
      pause: function() {
        var self = this;
        this.running = false;
      },
    }

    var display = tempTimer.display = tempTimer.container.append("div")
      .classed("timer", true);

    var time = display.append("p")
      .classed("timer-time", true)
      .text("TIME");

    var label = display.append("p")
      .classed("timer-label", true)
      .text("LABEL");

    tempTimer.alarm = display.append("audio")
      .classed("alarm", true)
      .attr("preload", "auto")
      

    tempTimer.alarm.append("source")
      .attr("src", "assets/sounds/timer3.mp3");
      
    handler.timers[tempTimer.id] = tempTimer;
    return tempTimer;
  }


  

})(this)
