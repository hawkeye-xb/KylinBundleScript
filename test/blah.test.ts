import { buildKylin } from '../src';
import { join } from 'path';

describe('blah', () => {
  it('works', () => {
    // expect(sum(1, 1)).toEqual(2);
    buildKylin({
      appName: 'godan',
      appId: 'com.electron.godan',
      unpackedDir: join(__dirname, 'static', 'linux-arm64-unpacked'),
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
  });
});
