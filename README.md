<div align="center">
  <a href="http://www.vlibras.gov.br/">
    <img
      alt="VLibras"
      src="http://www.vlibras.gov.br/assets/imgs/IcaroGrande.png"
    />
  </a>
</div>

# VLibras Plugin and Widget Services

VLibras Plugin is an addon which is installed in your browser. Supported by the following: Firefox, Chrome and Safari.

VLibras Widget is a widget that can be added onto your HTML page running along with a script, being also supported by the same browsers as the VLibras Plugin.

![Version](https://img.shields.io/badge/version-v0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![VLibras](https://img.shields.io/badge/vlibras%20suite-2019-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=)

## Table of Contents

- [Getting Started](#getting-started)
  - [System Requirements](#system-requirements)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
  - [Building](#building)
    - [Widget](#widget)
    - [Plugin](#plugin)
  - [Using Widget On Your Page](#using-widget-on-your-page)
- [Deployment](#deployment)
- [Contributors](#contributors)
- [License](#license)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### System Requirements

* OS: -  Windows / Linux / Mac OS
* Processor: - No minimum requirement. 
* Memory: -  No minimum requirement.
* Storage: - No minimum requirement.

### Prerequisites

In order to build and deploy a version of either the Plugin or Widget, some preinstallations are required. 

[Node.js](https://nodejs.org/en/)

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

```sh
sudo apt install -y nodejs
```
<br/>

[VLibras Player WebJS Repository](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-player-webjs)

This repository is required by the 'npm install' installation step (Check it on [Installing](#installing) section). 

The instructions are the following:

* Clone the VLibras Player WebJS repository **in the same root path** as the VLibras Plugin Repository.
  * VLibras Plugin Repository path: ${YOUR_PATH}/**vlibras-plugin-web**/
  * VLibras Player WebJS Repository path: ${YOUR_PATH}/**vlibras-player-webjs**/
* Make sure the name of the folder corresponding the VLibras Player WebJS is the one used in the path example: 'vlibras-player-webjs'.

> Note: It is necessary to have access to the VLibras Player WebJS repository to be able to clone it.

### Installing

After installing all the prerequisites, install the project by running the command:

```sh
npm install
```

Once the installation is completed, now you are able to build both the Plugin and Widget (Check it on [Building](#building) section).

### Building

#### Widget

To build the widget all you need to do is run the following:

```sh
npm run gulp build:widget
```
The build result will be present at widget/app/ folder. 

#### Plugin

To build the plugin you have two different options of building, according to the target browser you wish to build to:

- Firefox/Chrome - The build result will be present at webextensions folder.

```sh
npm run gulp build:webextensions
```

- Safari - The build result will be present at safari.safariextension folder.

```sh
npm run gulp build:safari
```

> Note: You can also generate all the builds to all targets at once by running: 
>```sh
>npm run gulp build
>```

## Using Widget on your page

Inside the "widget" folder contains another "app" folder that is generated. In it, it contains all the files needed to put the widget on your page.

In your html page before reaching the end of ```<body>```, you must put the content:

```html 
<div vw class="enabled">
  <div vw-access-button class="active"></div>
  <div vw-plugin-wrapper>
    <div class="vw-plugin-top-wrapper"></div> 
  </div>
</div>
<script src="app/vlibras-plugin.js"></script>
<script>
  new window.VLibras.Widget('app');
</script>
```

This works if your html page is in the same directory as the "app" folder. If you want to rename the "app" folder or put on another path, you must also change the path to be placed inside your html page, like the following example:

```html    
<script src="test/vlibras/vlibras-plugin.js"></script>
<script>
  new window.VLibras.Widget('test/vlibras');
</script>
```

Finally, running your html page on a server, you can use VLibras Widget.

## Deployment

Except for the widget, the plugins shall be added to the browser store of each browser supported by VLibras.

If you want to manually install or run the plugin in develop mode, check for instructions in the specific browser official page in order to do it.

## Contributors

* Suanny Fabyne - <suanny@lavid.ufpb.br>
* Mateus Pires - <mateuspires@lavid.ufpb.br>
* Thiago Filipe - <thiago.filipe@lavid.ufpb.br>

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details.
