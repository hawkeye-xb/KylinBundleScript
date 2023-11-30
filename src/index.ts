import fs from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

type ControlFileTypes = {
  Package: string,
  Version: string,
  Architecture: string,
  Maintainer: string,
  Description: string,
  [key:string]: string,
};

type DesktopFileTypes = {
  Name: string,
  'Name[zh_CN]': string,
  Exec: string,
  Icon: string,
  Type: string,
  [key:string]: string,
};

type BuildOptions = {
  appName: string, // package Name
  appId: string,
  unpackedDir: string,
  outputPath?: string;
  controlFile: ControlFileTypes,
  desktopFile: DesktopFileTypes,
  svgPath: string,
};

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
function getTheFilePathToBeCreated(options: {
  appName: string,
  appId: string,
  outputPath: string;
}) {
  const { appName, appId, outputPath } = options;

  const projectTemplateDir = join(outputPath, appId);
  fs.mkdirSync(join(projectTemplateDir, 'DEBIAN'), { recursive: true });
  fs.writeFileSync(join(projectTemplateDir, 'DEBIAN', 'compat'), '13');
  const controlFilePath = join(projectTemplateDir, 'DEBIAN', 'control');

  fs.mkdirSync(join(projectTemplateDir, 'opt', appName, appId), { recursive: true });
  const execFilesPath = join(projectTemplateDir, 'opt', appName, appId); // unpacked fs.copy to this
  
  fs.mkdirSync(join(projectTemplateDir, 'usr', 'share', 'applications'), { recursive: true });
  const desktopFilePath = join(projectTemplateDir, 'usr', 'share', 'applications', `${appId}.desktop`);

  fs.mkdirSync(join(projectTemplateDir, 'usr', 'share', 'icons', 'hicolor', 'scalable', 'apps'), { recursive: true });
  const iconFilePath = join(projectTemplateDir, 'usr', 'share', 'icons', 'hicolor', 'scalable', 'apps', `${appId}.svg`);

  return {
    projectTemplateDir,
    controlFilePath,
    execFilesPath,
    desktopFilePath,
    iconFilePath,
  }
}


export function buildKylin(options: BuildOptions) {
  const { appName, appId, outputPath = join(process.cwd(), 'output') } = options;

  console.info('outputPath', outputPath);
  const {
    projectTemplateDir,
    controlFilePath,
    execFilesPath,
    desktopFilePath,
    iconFilePath,
  } = getTheFilePathToBeCreated({ appName, appId, outputPath });

  console.info('controlFilePath', controlFilePath);
  fs.writeFileSync(controlFilePath, createControlFile(options.controlFile));

  console.info('execFilesPath', execFilesPath);
  execSync(`cp -r ${options.unpackedDir}/* ${execFilesPath}`);

  console.info('desktopFilePath', desktopFilePath);
  fs.writeFileSync(desktopFilePath, createDesktopFile(options.desktopFile));
  
  console.info('iconFilePath', iconFilePath);
  execSync(`cp ${options.svgPath} ${iconFilePath}`);

  execSync(`fakeroot dpkg-deb -b ${projectTemplateDir} ${outputPath}`);
}

function createControlFile(options: ControlFileTypes) {
  let result = '';
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      result += `${key}: ${value}\n`;
    }
  }
  return result;   
}

function createDesktopFile(options: DesktopFileTypes) {
  let result = '[Desktop Entry]\n';
  for (const [key, value] of Object.entries(options)) {
    if (value !== undefined) {
      result += `${key}=${value}\n`;
    }
  }
  return result;   
}