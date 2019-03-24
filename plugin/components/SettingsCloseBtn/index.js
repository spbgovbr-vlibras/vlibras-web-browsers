var btn_close_Tpl = require('./settings-close-btn.html');
require('./settings-close-btn.scss');

function SettingsCloseBtn(info, settings, dictionary){
    this.info = info;
    this.settings = settings;
    this.dictionary = dictionary;
    this.element = null;
}

SettingsCloseBtn.prototype.load = function(element){
    this.element = element;
    this.element.innerHTML = btn_close_Tpl;
    this.element.classList.add('btn-close');
    this.element.addEventListener('click', function(){
        if(this.info.visible){
            this.info.hide();
        }
        if(this.settings.visible){
            this.settings.hide(true);
        }
        if(this.dictionary.visible){
            this.dictionary.hide();
        }
        this.element.classList.remove('active')
        this.settings.showMenu();
    }.bind(this));
        
};



module.exports = SettingsCloseBtn;