function NonBlockingProcess(data, process, workingTime, watingTime, finish)
{
  this.data = data;
  this.process = process;
  this.workingTime = workingTime;
  this.watingTime = watingTime;
  this.finish = finish;

  this._event = null;
}

NonBlockingProcess.prototype.start = function()
{
  this._index = 0;
  this._event = setTimeout(this._work.bind(this), 0);
}

NonBlockingProcess.prototype.stop = function() {
  clearTimeout(this._event);
}

NonBlockingProcess.prototype.continue = function() {
  this._event = setTimeout(this._work.bind(this), 0);
}

NonBlockingProcess.prototype.isRunning = function() {
  return this._event === null;
}

NonBlockingProcess.prototype._work = function()
{
  var begin = new Date().getTime();
  var end = begin + this.workingTime;
  var initialIndex = this._index;

  while (new Date().getTime() < end && this._index < this.data.length)
    this.process(this.data[this._index++]);

  // console.log('NBP:', 'Processed ' + (this._index - initialIndex) + ' items from ' + initialIndex + '-' + this._index + ' for ' + (new Date().getTime() - begin) + ' ms.');

  if (this._index == this.data.length)
  {
    this._event = null;
    this.finish();
  }
  else
    this._event = setTimeout(this._work.bind(this), this.watingTime);
}

module.exports = NonBlockingProcess;