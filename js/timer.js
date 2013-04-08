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

        var millis = Math.abs(self.remaining);
        var hours = timeFormat(Math.floor(millis / 36e5)),
            mins = timeFormat(Math.floor((millis % 36e5) / 6e4)),
            secs = timeFormat(Math.floor((millis % 6e4) / 1000));
        return [hours, mins, secs].join(":");
      },
      tick: function(interval){
        var self = this;
        if (self.running) {
          self.elapsed += interval;
          self.remaining = self.duration - self.elapsed;
          self.display.select(".timer-text").text(self.getDisplayText() + " " + self.label);

          if (self.elapsed >= self.duration) {
            self.display.classed("finished", true);

          };
        };
      },
      label: function(text) {
        var self = this;
        if (!text) return self.label;
        self.label = text;
        return self;
      }
    }

    var display = tempTimer.display = tempTimer.container.append("div")
      .classed("timer", true);

    var text = display.append("p")
      .classed("timer-text", true)
      .text("INIT");


      
    handler.timers[tempTimer.id] = tempTimer;
    return tempTimer;
  }


  

})(this)
