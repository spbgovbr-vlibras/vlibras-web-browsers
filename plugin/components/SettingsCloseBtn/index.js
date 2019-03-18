var btn_close_Tpl = require('./settings-close-btn.html');
require('./settings-close-btn.scss');

function SettingsCloseBtn(){
    this.element = null;
}

SettingsCloseBtn.prototype.load = function(element){
    this.element = element;
    this.element.innerHTML = btn_close_Tpl;
    this.element.classList.add('btn-close');
        
};


module.exports = SettingsCloseBtn;