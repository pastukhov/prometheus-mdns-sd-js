const dnssd = require('dnssd');
const writeFileAtomic = require('write-file-atomic')
const axios = require('axios').default;
const prometheus_sd_file = process.env.PROMETHEUS_SD_FILE;
const vmagent_address = process.env.VMAGENT_ADDRESS;

var targets = [];

function filltarget(service) {
  const target = {
    "targets": service.addresses,
    "labels": {
      "instance": service.name,
      "discovery": "mdns",
      "__scheme__": "http"
    }
  };
  targets.push(target);
  console.log(targets);
  writeFileAtomic(prometheus_sd_file, JSON.stringify(targets, null, 4), reloadVMAgent());
}

function cleantarget(service) {
  targets = targets.filter(target => target.labels.instance !== service.name);
  console.log(targets);
  writeFileAtomic(prometheus_sd_file, JSON.stringify(targets, null, 4), reloadVMAgent());
}

async function reloadVMAgent() {
  try {
    const response = await axios.post(vmagent_address);
  } catch (error) {
    console.error(error);
  }
}
const browser = dnssd.Browser(dnssd.tcp('_prometheus-http'))
  .on('serviceUp', service => filltarget(service))
  .on('serviceDown', service => cleantarget(service))
  .start();

  module.exports = filltarget, cleantarget;

