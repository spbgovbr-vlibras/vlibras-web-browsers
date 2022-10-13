function NonBlockingProcess(data, process, workingTime, watingTime, finish) {
  this.data = data;
  this.process = process;
  this.workingTime = workingTime;
  this.watingTime = watingTime;
  this.finish = finish;

  this._event = null;
}

NonBlockingProcess.prototype.start = function() {
  this._index = 0;
  this._event = setTimeout(this._work.bind(this), 0);
};

NonBlockingProcess.prototype.stop = function() {
  clearTimeout(this._event);
};

NonBlockingProcess.prototype.continue = function() {
  this._event = setTimeout(this._work.bind(this), 0);
};

NonBlockingProcess.prototype.isRunning = function() {
  return this._event === null;
};

NonBlockingProcess.prototype._work = function() {
  const begin = new Date().getTime();
  const end = begin + this.workingTime;

  while (new Date().getTime() < end && this._index < this.data.length) {
    this.process(this.data[this._index++]);
  }


  if (this._index == this.data.length) {
    this._event = null;
    this.finish();
  } else {
    this._event = setTimeout(this._work.bind(this), this.watingTime);
  }
};

module.exports = NonBlockingProcess;
