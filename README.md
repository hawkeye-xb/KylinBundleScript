# Kylin bundle script
Build the deb installation package script of kylin OS for electron-builder

# config
```js
/*
├── DEBIAN
│   └── control
├── opt
│   └── ${appName}
      ---- ${exec files, named appId}
└── usr
    └── share
        ├── applications
        // │   └── ${appId}.desktop
        └── icons
            └── hicolor
                └── scalable
                    └── apps
                        // └── ${appId}.svg
*/
buildKylin({
  appName: 'godan',
  appId: 'com.electron.godan',
  unpackedDir: join(__dirname, 'static', 'linux-arm64-unpacked'),
  outputPath: join(__dirname, 'output'),
  version: '0.1.0',
  controlFile: {
    Package: 'godan',
    Version: '0.1.0',
    Architecture: 'arm64',
    Maintainer: 'test<godan@mail.com>',
    Description: 'test description',
  },
  desktopFile: {
    Name: 'godan',
    'Name[zh_CN]': 'godan',
    Exec: '/opt/godan/com.electron.godan/electron-godan --no-sandbox', // TODO: how to get this?
    Icon: 'godan',
    Type: 'Application',
  },
  svgPath: join(__dirname, 'static', 'icon.svg'),
});
/*
output
├── godan_0.1.0
│   ├── DEBIAN
│   │   ├── compat
│   │   └── control
│   ├── opt
│   │   └── godan
│   │       └── com.electron.godan
│   └── usr
│       └── share
│           ├── applications
│           └── icons
└── godan_0.1.0_arm64.deb
*/ 
``` 
