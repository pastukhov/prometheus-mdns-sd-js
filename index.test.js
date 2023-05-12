const dnssd = require('dnssd');
const { Browser } = dnssd;

const { filltarget, cleantarget } = require('./index');

jest.mock('dnssd', () => {
  return {
    Browser: jest.fn().mockImplementation(() => {
      return {
        on: jest.fn().mockReturnThis(),
        start: jest.fn()
      };
    })
  };
});

describe('DNS-SD functions', () => {
  let browser;
  let service;

  beforeEach(() => {
    browser = new Browser();
    service = { addresses: ['192.168.0.1'], name: 'example-service' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('filltarget', () => {
    it('should add target to targets array', () => {
      const target = {
        "targets": service.addresses,
        "labels": {
          "instance": service.name,
          "discovery": "mdns",
          "__scheme__": "http"
        }
      };

      filltarget(service);

      expect(targets).toContainEqual(target);
    });
  });

  describe('cleantarget', () => {
    it('should remove target from targets array', () => {
      const target = {
        "targets": service.addresses,
        "labels": {
          "instance": service.name,
          "discovery": "mdns",
          "__scheme__": "http"
        }
      };

      // Заполняем targets перед тестом
      targets.push(target);

      cleantarget(service);

      expect(targets).toHaveLength(0);
    });

    it('should keep other targets in targets array', () => {
      const target1 = {
        "targets": ['192.168.0.1'],
        "labels": {
          "instance": 'example-service',
          "discovery": "mdns",
          "__scheme__": "http"
        }
      };

      const target2 = {
        "targets": ['192.168.0.2'],
        "labels": {
          "instance": 'other-service',
          "discovery": "mdns",
          "__scheme__": "http"
        }
      };

      // Заполняем targets перед тестом
      targets.push(target1, target2);

      cleantarget(service);

      expect(targets).toContainEqual(target2);
      expect(targets).not.toContainEqual(target1);
    });
  });
});
