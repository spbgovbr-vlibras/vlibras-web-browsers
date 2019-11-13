<div align="center">
  <a href="http://www.vlibras.gov.br/">
    <img
      alt="VLibras"
      src="https://vlibras.gov.br/assets/imgs/IcaroGrande.png"
    />
  </a>
</div>

# VLibras Web (Plugins and Widget)

VLibras Web Plugins and Widget are extensions for web browsers and HTML pages.

![Version](https://img.shields.io/badge/version-v5.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-chrome%20%7C%20firefox%20%7C%20safari-lightgrey)
![License](https://img.shields.io/badge/license-LGPLv3-blue.svg)
![VLibras](https://img.shields.io/badge/vlibras%20suite-2019-green.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAUCAYAAAC9BQwsAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wIHCiw3NwjjIgAAAQ9JREFUOMuNkjErhWEYhq/nOBmkDNLJaFGyyyYsZzIZKJwfcH6AhcFqtCvFDzD5CQaTFINSlJJBZHI6J5flU5/P937fube357m63+d+nqBEagNYA9pAExgABxHxktU3882hjqtd9d7/+lCPsvpDZNA+MAXsABNU6xHYQ912ON2qC2qQ/X+J4XQXEVe/jwawCzwNAZp/NCLiDVgHejXgKIkVdGpm/FKXU/BJDfytbpWBLfWzAjxVx1Kuxwno5k84Jex0IpyzdN46qfYSjq18bzMHzQHXudifgQtgBuhHxGvKbaPg0Klaan7GdqE2W39LOq8OCo6X6kgdeJ4IZKUKWq1Y+GHVjF3gveTIe8BiCvwBEZmRAXuH6mYAAAAASUVORK5CYII=)

## Table of Contents

- [Getting Started](#getting-started)
  - [System Requirements](#system-requirements)
  - [Prerequisites](#prerequisites)
  - [Installing](#installing)
- [Compilation](#building)
  - [Building the Widget](#building-the-widget)
  - [Building the Plugins](#building-the-plugins)
- [Installation](#installation)
  - [Installing the Widget](#installing-the-widget)
  - [Installing the Plugins](#installing-the-plugins)
- [Contributors](#contributors)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project compiled and running on your local machine for development and testing purposes.

### System Requirements

* OS: Ubuntu 18.04.2 LTS (Bionic Beaver) or Later

### Prerequisites

Before starting the build of the tools, you need to install some prerequisites:

[Node.js](https://nodejs.org/en/)

```sh
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

```sh
sudo apt install -y nodejs
```
<br/>

[VLibras Player WebJS](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-player-webjs)

VLibras Player WebJS is required at project installation, you just need to clone it in the same path as the root of this project.

```sh
git clone https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-player-webjs.git
```

> Note: It is necessary to have access to the VLibras Player WebJS repository to be able to clone it.

### Installing

After installing all the prerequisites, install the project by running the command:

```sh
cd vlibras-web-browsers/
```

```sh
npm install
```

## Building

When the installation is complete, you can now build the Plugins and Widget.

### Building the Widget

```sh
npm run gulp build:widget
```

The compiled file can be found in the `widget/app/` folder. Go to the [Widget installation section](#installing-the-widget) for installation instructions.

### Building the Plugins

To build the plugin you have two different options of building, according to the target browser you wish to build to:

- Firefox/Chrome - the compiled files can be found in the `webextensions` folder.

```sh
npm run gulp build:webextensions
```

- Safari - the compiled files can be found in the `safari.safariextension` folder.

```sh
npm run gulp build:safari
```

> Note: You can also generate all the builds to all targets at once by running the command: `npm run gulp build`

## Installation

### Installing the Widget

The Widget can be installed on your website by inserting a few snippets of code before closing the `<body>` tag of a HTML page:

```html
<body> <!-- Begin of the page body -->

  ... <!-- Content of the page -->

  <div vw class="enabled">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper>
      <div class="vw-plugin-top-wrapper"></div>
    </div>
  </div>
  <script src="<your-directory-path>/app/vlibras-plugin.js"></script>
  <script>
    new window.VLibras.Widget('<your-directory-path>/app');
  </script>
</body> <!-- End of the page body -->
```

> Note: The app folder can be copied to any directory, remember to enter the correct path for it.

### Installing the Plugins

VLibras already has official versions of the plugins in the Chrome, Firefox and Safari extensions store.
To use the version of the plugins built in your machine, see the extensions installation instructions
on your browser's official page.

## Contributors

* Mateus Pires - <mateuspires@lavid.ufpb.br>
* Suanny Fabyne - <suanny@lavid.ufpb.br>
* Thiago Filipe - <thiago.filipe@lavid.ufpb.br>

## License

This project is licensed under the LGPLv3 License - see the [LICENSE](LICENSE) file for details.
